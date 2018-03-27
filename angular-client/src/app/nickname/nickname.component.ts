import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.css']
})
export class NicknameComponent implements OnInit {

  nickname: string;

  constructor(private chatService: ChatService,
              private router: Router ) { }

  ngOnInit() {
    this.chatService.onLogin()
      .subscribe(loginSuccess => {
        if (loginSuccess) this.router.navigate(['lobby']);
        else this.loginFailed();
      });
  }

  loginFailed() {

  }

  login() {
    this.chatService.sendLogin(this.nickname);
  }

}
