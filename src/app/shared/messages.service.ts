import { Message } from './message.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages: Message[] = [];
  messagesChange = new Subject<Message[]>();
  fetchingMessages = new Subject<boolean>();
  isSendingMessage = new Subject<boolean>();
  messagesInterval!: number;
  messagesIntervalSubscription!: Subscription;
  lastDatetime!: string;
  currentDatetime!: string;
  isMessagesInterval = false;
  messagesObservable!: Observable<Message[]>;

  constructor(
    private http: HttpClient,
  ) {
  }

  fetchMessages() {
    this.fetchingMessages.next(true);
    this.http.get<Message[]>('http://146.185.154.90:8000/messages').pipe(
      map(messages => {
        this.fetchingMessages.next(false);
        this.lastDatetime = messages[messages.length - 1].datetime;
        return messages;
      })).subscribe(messages => {
      messages.splice(1, 15);
      this.messages = messages;
      this.sortMessagesByDate();
      this.messagesChange.next(this.messages);
    }, () => {
      this.fetchingMessages.next(false);
    });
  }


  start() {
    if (!this.isMessagesInterval) {
      this.messagesObservable = new Observable(observer => {
        this.messagesInterval = setInterval(() => {
          this.http.get<Message[]>(`http://146.185.154.90:8000/messages`).pipe(
            map(messages => {
              console.log('in interval');
              this.isMessagesInterval = true;
              this.currentDatetime = messages[messages.length - 1].datetime;
              if (this.lastDatetime !== this.currentDatetime) {
                this.fetchingMessages.next(true);
                this.lastDatetime = this.currentDatetime;
                messages.splice(1, 15);
                observer.next(messages);
              }
              return this.messages;
            })).subscribe((messages: Message[]) => {
              observer.next(messages);
          });
        }, 2000);
      });
      this.messagesIntervalSubscription = this.messagesObservable.subscribe(messages => {
        this.messages = messages;
        this.sortMessagesByDate();
        this.fetchingMessages.next(false);
        this.messagesChange.next(this.messages);
      }, () => {
        this.fetchingMessages.next(false);
      });
    }
  }

  stop() {
    this.messagesIntervalSubscription.unsubscribe();
    this.isMessagesInterval = false;
    clearInterval(this.messagesInterval);
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
