import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { ChatComponent } from './chat/chat.component';
import { VideoComponent } from './video/video.component';

import { ChatService } from './chat.service';

const routes: Routes = 
  [
    { path: "", component: LobbyComponent },
    { path: "chat/r/:room", component: ChatComponent },
    { path: "chat/u/:user", component: ChatComponent },
    { path: "video", component: VideoComponent }
  ];

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    ChatComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
