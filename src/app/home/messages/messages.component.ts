import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from '../../shared/messages.service';
import { Message } from '../../shared/message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  isFetchingMessages: boolean = false;
  messagesSubscription!: Subscription;
  fetchingMessagesSubscription!: Subscription;

  constructor(
    private messagesService: MessagesService,
  ) { }

  ngOnInit(): void {
    this.messagesSubscription = this.messagesService.messagesChange.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
    this.fetchingMessagesSubscription = this.messagesService.fetchingMessages.subscribe((isFetching: boolean) => {
      this.isFetchingMessages = isFetching;
    });
    this.messagesService.fetchMessages();
  }


  ngOnDestroy() {
    this.messagesSubscription.unsubscribe();
    this.fetchingMessagesSubscription.unsubscribe();
  }

}
