import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { ChatComponent } from './chat/chat.component';
import { VideoComponent } from './video/video.component';
import { NicknameComponent } from './nickname/nickname.component';

import { ChatService } from './chat.service';
import { LobbyAuthGuard, ChatAuthGuard } from './chat-auth-guard.service';

// Material UI Components
import { } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

const routes: Routes = 
  [
    { path: "lobby", component: LobbyComponent, canActivate: [LobbyAuthGuard] },
    { path: "chat", component: ChatComponent, canActivate: [ChatAuthGuard] },
    { path: "video", component: VideoComponent },
    { path: "", component: NicknameComponent }
  ];

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    ChatComponent,
    VideoComponent,
    NicknameComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,

    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule

  ],
  providers: [ChatService, LobbyAuthGuard, ChatAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
