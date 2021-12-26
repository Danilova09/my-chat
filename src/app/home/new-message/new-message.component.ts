import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  @ViewChild('messageForm') messageForm!: NgForm;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // console.log(this.messageForm.value.author, this.messageForm.value.message);
  }

}
