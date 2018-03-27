import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class ChatService {

  private socket = Observable.webSocket('ws://localhost:9090');
  private connections = [];


  constructor() { 
    this.socket.subscribe((msg) => console.log(msg), (err) => console.log(err), () => console.log('fin'));
    this.socket.next(JSON.stringify({ hey: "john" }));
  }

  sendMessage() {

  }

}

@Injectable()
export class RTCService {

  constructor() {}

  onAnswer() {

  }

  onOffer() {

  }

  openDataChannel() {

  }

}

function onStateChange(e) {
  console.log('State change... :', e);
}