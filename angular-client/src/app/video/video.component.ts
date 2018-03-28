import { Component, OnInit } from '@angular/core';

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

}
