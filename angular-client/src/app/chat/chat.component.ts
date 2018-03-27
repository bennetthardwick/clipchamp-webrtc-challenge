import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message: string = "";
  reply: string = "";

  constructor(private chatService: ChatService, private change: ChangeDetectorRef) {


    this.chatService.onRTCMessage()
      .subscribe(message => { this.reply = message; this.change.detectChanges(); });

   }

  ngOnInit() {

  }

  send() {
    this.chatService.sendRTCMessage(this.message);
  }

}
