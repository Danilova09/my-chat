import { Message } from './message.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages: Message[] = [];
  messagesChange = new Subject<Message[]>();
  fetchingMessages = new Subject<boolean>();
  isSendingMessage = new Subject<boolean>();

  constructor(
    private http: HttpClient,
  ) {
  }

  fetchMessages() {
    let lastDatetime: string;
    this.fetchingMessages.next(true);
    this.http.get<Message[]>('http://146.185.154.90:8000/messages').pipe(
      map(messages => {
        this.fetchingMessages.next(false);
        lastDatetime = messages[messages.length - 1].datetime;
        return messages;
      })).subscribe(messages => {
      this.messages = messages;
      this.sortMessagesByDate();
      this.messagesChange.next(this.messages);
    }, () => {
      this.fetchingMessages.next(false);
    });

    const interval = setInterval(() => {
      let currentDatetime: string;
      this.http.get<Message[]>(`http://146.185.154.90:8000/messages`).pipe(
        map(messages => {
          currentDatetime = messages[messages.length - 1].datetime;
          this.fetchingMessages.next(false);
          if (lastDatetime !== currentDatetime) {
            this.fetchingMessages.next(true);
            lastDatetime = currentDatetime;
            return messages;
          }
          return this.messages;
        })).subscribe(messages => {
        this.messages = messages;
        this.sortMessagesByDate();
        this.fetchingMessages.next(false);
        this.messagesChange.next(this.messages);
      }, () => {
        this.fetchingMessages.next(false);
      });
    }, 2000);
  }

  sortMessagesByDate() {
    this.messages.sort((currentMessage: Message, nextMessage: Message) => {
      return <any>new Date(nextMessage.datetime) - <any>new Date(currentMessage.datetime);
    });
  }

  sendMessage(author: string, message: string) {
    this.isSendingMessage.next(true);
    const body = new HttpParams()
      .set('author', author)
      .set('message', message);
    this.http.post('http://146.185.154.90:8000/messages', body).pipe(
      tap(() => {
        this.isSendingMessage.next(false);
      }, () => {
        this.isSendingMessage.next(false);
      })).subscribe();
  }

}
