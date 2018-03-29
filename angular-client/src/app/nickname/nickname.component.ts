import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.css']
})
export class NicknameComponent implements OnInit {

  nickname: string;

  constructor(private chatService: ChatService,
              private router: Router,
              private snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.chatService.onLogin()
      .subscribe(loginSuccess => {
        if (loginSuccess) this.router.navigate(['/lobby']);
        else this.loginFailed();
      });
  }

  loginFailed() {
    this.snackBar.open('Login failed. Please try again with another nickname.', 'Close', { duration: 2000 });
  }

  login() {
    this.chatService.sendLogin(this.nickname);
  }

}
