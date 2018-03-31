import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  nickname: string;
  remoteNickname: string;

  message: string = "";
  messages: IReply[] = [];

  constructor(private chatService: ChatService, private change: ChangeDetectorRef) {

    this.nickname = this.chatService.getNickname();
    this.remoteNickname = this.chatService.getRemoteNickname();

    this.chatService.onRTCMessage()
      .subscribe((message: string) => { 
        this.messages.push({ nickname: this.remoteNickname, message: message }); 
        this.change.detectChanges(); 
      });

   }

  send() {
    if (this.message.replace(/\s/g, "").split("").length <= 0) return;
    this.chatService.sendRTCMessage(this.message);
    this.messages.push({ nickname: this.nickname, message: this.message });
    this.message = "";
  }

}

interface IReply {
  nickname: string;
  message: string;
}
