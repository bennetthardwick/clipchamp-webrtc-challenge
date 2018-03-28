import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';

import { Observable, Subject } from 'rxjs';

@Injectable()
export class ChatService {

  private socket = Observable.webSocket('ws://localhost:9090');

  private connection: RTCPeerConnection;
  private dataChannel: RTCDataChannel;
  private receiveChannel: RTCDataChannel;

  private socketEvents: SocketChatEvents = {};
  private RTCMessage;

  private nickname;
  private nicknameSet: boolean = false;

  private remoteNickname;
  private remoteNicknameSet: boolean = false;

  private offers: any = {};
  private candidate: any;

  constructor() { 
    this.RTCMessage = new Subject();
    this.prepareObservableSocket();
    this.prepareForAnswer();
    this.prepareForCandidate();
    this.prepareForLogin();
  }

  createOfferTo(user: string): void {

    console.log(this.RTCMessage);
    this.remoteNickname = user;

    this.connection.createOffer()
      .then((offer) => { 
        this.sendMessage({ type: 'offer', offer: offer, name: user }); 
        this.connection.setLocalDescription(offer);
      }).catch((err) => console.log(err));
  }

  listenForDataChannel = (event) => {

    this.receiveChannel = event.channel;
    this.receiveChannel.onmessage = (message) => this.RTCMessage.next(message.data);
  }

  openDataChannel(): void {
    this.dataChannel = this.connection.createDataChannel("chat");
    this.dataChannel.onerror = (err) => console.error(err);
    this.dataChannel.onmessage = (msg) => console.log(msg);
  }

  prepareObservableSocket(): void {
    this.socketEvents = {
      message: new Subject(),
      login: new Subject(),
      offer: new Subject(),
      candidate: new Subject(),
      answer: new Subject(),
      lobby: new Subject()
    };

    this.socket.subscribe((data: any) => {
      this.socketEvents.message.next(data);

      switch (data.type) {
        case 'lobby':
          this.socketEvents.lobby.next(data.data);
        break;
        case 'login':
          this.socketEvents.login.next(data.success)
        break;

        case 'offer':

          this.offers[data.name] = data.offer;
          this.socketEvents.offer.next(data.name)
        break;

        case 'candidate':

          if(data.name == this.remoteNickname)
            this.candidate = data.candidate;

        break;

        case 'answer':
          this.socketEvents.answer.next(data.answer)
        break;

        case 'ping':
          this.sendMessage({ type: 'pong' });
        break;

      }

    }, (err) => console.log(err), () => console.log('Socket terminated'));
  };

  sendMessage(message) {
    this.socket.next(JSON.stringify(message));
  }

  sendRTCMessage(message) {
    this.dataChannel.send(message);
  }

  onRTCMessage(): Subject<any> {
    return this.RTCMessage;
  }

  acceptOffer(name) {

    let offer = this.offers[name];

    if (offer) {
      this.remoteNickname = name;
      this.connection.setRemoteDescription(new RTCSessionDescription(offer));
      this.socketEvents.candidate.next(this.candidate);
      this.connection.createAnswer()
        .then((answer) => {
          this.connection.setLocalDescription(answer);
          this.sendMessage({ type: 'answer', answer: answer, name: name });
        }).catch((err) => console.log(err));
    } else {
      throw "err";
      
    }    
  }

  prepareForLogin() {
    this.onLogin().subscribe(success => {
      if (success === false) {
        this.nickname == null;
        this.nicknameSet = false;
      } else {

        this.nicknameSet = true;

        let config: RTCConfiguration = { iceServers: [{ urls: "stun:stun.1.google.com:19302"}]};
        this.connection = new RTCPeerConnection(config);

        this.connection.onicecandidate = (event) => {
          if (event.candidate) this.sendMessage({ type: 'candidate', candidate: event.candidate, name: this.remoteNickname });
        };

        this.connection.ondatachannel = this.listenForDataChannel;

        this.openDataChannel();

      }
    });
  }

  prepareForAnswer() {
    this.onAnswer().subscribe((answer) => {
      this.connection.setRemoteDescription(new RTCSessionDescription(answer));
    });
  }

  prepareForCandidate() {
    this.onCandidate().subscribe((candidate) => {

      console.log(candidate);

      this.connection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(err => console.log(err));
    });
  }

  getLobby(): Subject<string[]> {
    this.sendMessage({ type: 'lobby' });
    return this.socketEvents.lobby;
  }

  private closeConnections() {
    this.connection.close();
    this.dataChannel.close();
  }

  private onCandidate() {
    return this.socketEvents.candidate;
  }

  onOffer() {
    return this.socketEvents.offer;
  }

  onAnswer() {
    return this.socketEvents.answer;
  }

  onSuccessfulConnection() {

  }

  onLobby() {
    return this.socketEvents.lobby;
  }

  onLogin() {
    return this.socketEvents.login;
  }

  receiveMessage(message) {
    this.RTCMessage.next(message);
  }

  sendLogin(user: string) {
    this.sendMessage({ type: 'login', name: user });
  }

  private onMessage() {
    return this.socketEvents.message;
  }

  isNicknameSet(): boolean {
    return this.nicknameSet; 
  }

  isRemoteNicknameSet(): boolean {
    return this.remoteNicknameSet;
  }

}

interface SocketChatEvents {
  message?: Subject<any>;
  login?: Subject<boolean>;
  offer?: Subject<string>;
  answer?: Subject<RTCSessionDescription>;
  candidate?: Subject<RTCIceCandidateInit>;
  lobby?: Subject<string[]>;
}

interface RTCChatEvents {
  message?: Subject<any>;
}