import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private chatService: ChatService,
              private snackBar: MatSnackBar) {
    this.chatService.onError()
      .subscribe(() => this.snackBar.open('An unexpected error occured. Please refresh the page and try again.', 'Close'))
  }
}
