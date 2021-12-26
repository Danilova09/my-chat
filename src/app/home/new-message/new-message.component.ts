import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessagesService } from '../../shared/messages.service';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  @ViewChild('messageForm') messageForm!: NgForm;

  constructor(
    private messagesService: MessagesService,
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.messagesService.sendMessage(this.messageForm.value.author, this.messageForm.value.message);
  }

}
