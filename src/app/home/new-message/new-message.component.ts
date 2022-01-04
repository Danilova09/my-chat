import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessagesService } from '../../shared/messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit, OnDestroy {
  @ViewChild('messageForm') messageForm!: NgForm;
  isSending: boolean = false;
  sendingSubscription!: Subscription;


  constructor(
    private messagesService: MessagesService,
  ) { }

  ngOnInit(): void {
    this.sendingSubscription = this.messagesService.isSendingMessage.subscribe((isSending: boolean) => {
      this.isSending = isSending;
    })
  }

  onSubmit() {
    this.messagesService.sendMessage(this.messageForm.value.author, this.messageForm.value.message);
  }

  ngOnDestroy() {
    this.sendingSubscription.unsubscribe();
  }

}
