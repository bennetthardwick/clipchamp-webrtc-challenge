import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  lobby: string[] = [];

  sentOffer: boolean = false;
  remoteName: string = "";

  constructor(private chatService: ChatService,
              private router: Router ) { }

  ngOnInit() {
    this.chatService.onLobby()
      .subscribe(lobby => this.lobby = lobby);

    this.chatService.onOffer()
      .subscribe(name => {

        console.log(name);

        console.log('got an offer');

        this.sentOffer = true;
        this.remoteName = name;
      })

    this.chatService.onAnswer()
      .subscribe(() => this.router.navigate(['chat']));

    this.chatService.getLobby();

  }

  offer(user) {
    this.chatService.createOfferTo(user);
  }

  accept(name) {
    this.chatService.acceptOffer(name);
    this.router.navigate(['chat']);
  }

  connectionSuccessful() {

  }

  connectionFailed() {

  }

}
