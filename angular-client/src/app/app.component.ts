import { Component, OnInit } from '@angular/core';

import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  name: string = "";
  remoteName: string = "";
  message: string = "";

  constructor(private chatService: ChatService) {}

  ngOnInit() {

  }

  login() {
    this.chatService.login(this.name)
  }

  connect() {
    this.chatService.createOfferTo(this.remoteName);
  }

  send() {
    this.chatService.sendRTCMessage(this.message);
  }

}
