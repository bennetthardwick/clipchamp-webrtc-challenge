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

  constructor(private chatService: ChatService,
              private router: Router ) { }

  ngOnInit() {
    this.chatService.onLobby()
      .subscribe(lobby => this.lobby = lobby);

    this.chatService.onSuccessfulConnection()
      /*.subscribe(connectionSuccess => {
        if (connectionSuccess) this.connectionSuccessful();
        else this.connectionFailed();
      });*/

    this.chatService.getLobby();

  }

  createOffer(user) {

  }

  connectionSuccessful() {

  }

  connectionFailed() {

  }

}
