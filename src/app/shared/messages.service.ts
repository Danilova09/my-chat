import { Message } from './message.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages: Message[] = [];
  fetchingMessages = new Subject<boolean>();
  messagesChange = new Subject<Message[]>();

  constructor(
    private http: HttpClient,
  ) {}

  fetchMessages() {
    this.fetchingMessages.next(true);
    this.http.get<Message[]>('http://146.185.154.90:8000/messages').pipe(
      map(messages => {
        this.fetchingMessages.next(false);
        return messages;
      }, () => {
      })).subscribe(messages => {
        this.messages = messages;
        this.sortMessagesByDate();
        this.messagesChange.next(this.messages);
    }, () => {
      this.fetchingMessages.next(false);
    });
  }

  sortMessagesByDate() {
    this.messages.sort((currentMessage: Message, nextMessage: Message) => {
      return  <any>new Date(nextMessage.datetime) - <any>new Date(currentMessage.datetime);
    })
  }

  sendMessage(author: string, message: string) {
    let body = new URLSearchParams();
    body.set('author', `${author}`);
    body.set('message', `${message}`);
    this.http.post('http://146.185.154.90:8000/messages', body).subscribe(result => {
      console.log(result);
    })
    this.fetchMessages();
  }

}
