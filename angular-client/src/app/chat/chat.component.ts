import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message: string = "";
  reply: string = "";

  constructor(private route: ActivatedRoute,
              private chatService: ChatService) {

    this.route.params.subscribe(params => {
      console.log(params);
      this.chatService.createOfferTo(params.user);
      console.log('created offer');
    });

    this.chatService.onRTCMessage()
      .subscribe(message => this.reply = message);

   }

  ngOnInit() {

  }

  send() {
    this.chatService.sendRTCMessage(this.message);
  }

}
