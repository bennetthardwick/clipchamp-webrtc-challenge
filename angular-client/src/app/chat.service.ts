import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';

import { Observable, Subject } from 'rxjs';

@Injectable()
export class ChatService {

  private socket;

  private connection: RTCPeerConnection;
  private dataChannel: RTCDataChannel;
  private receiveChannel: RTCDataChannel;

  private socketEvents: SocketChatEvents = {};
  private RTCMessage: Subject<any>;

  private nickname: string;
  private nicknameSet: boolean = false;

  private remoteNickname: string;
  private remoteNicknameSet: boolean;

  private RTCconnected: boolean;

  private offers: any = {};
  private candidate: any;

  constructor() { 
    this.reset();
  }

  reset() {
    this.connection = null;
    this.dataChannel = null;
    this.receiveChannel = null;

    this.socketEvents = {};

    this.remoteNickname = null;
    this.remoteNicknameSet = false;

    this.RTCconnected = false;

    this.offers = {};
    this.candidate = null;

    this.socket = Observable.webSocket('ws://localhost:9090');
    this.RTCMessage = new Subject();
    this.prepareObservableSocket();
    this.prepareForAnswer();
    this.prepareForCandidate();
    this.prepareForLogin();
  }

  /**
   * Create and send an offer to a remote user through the signaling server
   * @param {string} nickname the nickname of the user to send an offer to
   */
  createOfferTo(user: string): void {
    this.remoteNickname = user;
    this.remoteNicknameSet = true;

    this.connection.createOffer()
      .then((offer) => { 
        this.sendMessage({ type: 'offer', offer: offer, name: user }); 
        this.connection.setLocalDescription(offer);
      }).catch((err) => console.log(err));
  }

  /**
   * @param {string} message message to be sent over RTC
   */
  sendRTCMessage(message: string): void {
    this.dataChannel.send(message);
  }

  /**
   * Accept an offer from a remote user
   * @param {string} name the name of the remote user, whose offer you want to accept
   */
  acceptOffer(name: string): void {

    let offer = this.offers[name];

    if (offer) {
      this.remoteNickname = name;
      this.remoteNicknameSet = true;
      this.connection.setRemoteDescription(new RTCSessionDescription(offer));
      this.socketEvents.candidate.next(this.candidate);
      this.connection.createAnswer()
        .then((answer) => {
          this.connection.setLocalDescription(answer);
          this.sendMessage({ type: 'answer', answer: answer, name: name });
          this.RTCconnected = true;
        }).catch((err) => console.error(err));
    } else {
      throw "err";
    }    
  }

  /**
   * Send a message to the signaling server to fetch the lobby
   * @return {Subject<string[]>} the names of the current members of the lobby
   */
  getLobby(): Subject<string[]> {
    this.sendMessage({ type: 'lobby' });
    return this.socketEvents.lobby;
  }

  /**
   * Return the nickname of the current user
   * @return {string} nickname
   */
  getNickname(): string {
    return this.nickname;
  }

  /**
   * Get the nickname of the currently connected user
   * @return {string} remote nickname
   */
  getRemoteNickname(): string {
    return this.remoteNickname;
  }

  /**
   * @return {Subject<string>} name of the user offering a connection
   */
  onOffer(): Subject<string> {
    return this.socketEvents.offer;
  }

  /**
   * @return {Subject<any>} a message sent over RTC
   */
  onRTCMessage(): Subject<any> {
    return this.RTCMessage;
  }

  /**
   * @return {Subject<RTCSessionDescription>} answer from a remote user
   */
  onAnswer(): Subject<RTCSessionDescription> {
    return this.socketEvents.answer;
  }

  /**
   * A Subject that when subscribed will return the current members of the lobby
   * @return {Subject<string[]>} the names of the current members of the lobby 
   */
  onLobby(): Subject<string[]> {
    return this.socketEvents.lobby;
  }

  /**
   * @return {Subject<boolean>} boolean representing whether the login attempt was successful
   */
  onLogin(): Subject<boolean> {
    return this.socketEvents.login;
  }

  /**
   * Send a login message to the signaling server 
   * @param {string} nickname the nickname to log in using
   */
  sendLogin(nickname: string) {
    this.nickname = nickname; 
    this.sendMessage({ type: 'login', name: nickname });
  }

  /**
   * @return {boolean} bool representing whether the users nickname has been set
   */
  isNicknameSet(): boolean {
    return this.nicknameSet; 
  }

  /**
   * @return {boolean} bool representing whether the remote users nickname has been set
   */
  isRemoteNicknameSet(): boolean {
    return this.remoteNicknameSet;
  }

  /**
   * Send a message to the signaling server
   * @param {any} message message to be sent to the signaling server
   */
  private sendMessage(message: any): void {
    this.socket.next(JSON.stringify(message));
  }

  /**
   * Sets up listeners that handle a login reply from the signaling server
   */
  private prepareForLogin(): void {
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

        this.openDataChannel();
        this.connection.ondatachannel = this.listenForDataChannel;

      }
    });
  }

  private listenForDataChannel = (event) => {
    this.receiveChannel = event.channel;
    this.receiveChannel.onmessage = (message) => this.RTCMessage.next(message.data);
  }

  /**
   * Opens an RTC datachannel and sets up listeners to handle messages
   */
  private openDataChannel(): void {
    this.dataChannel = this.connection.createDataChannel("chat");
    this.dataChannel.onerror = (err) => console.error(err);
    this.dataChannel.onmessage = (message) => this.RTCMessage.next(message.data);
  }

  /**
   * Sets up listeners and observables to handle all events from the signaling server 
   */
  private prepareObservableSocket(): void {
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
          this.candidate = data.candidate;
        break;

        case 'answer':
          this.socketEvents.answer.next(data.answer)
        break;

        case 'ping':
          if (!this.RTCconnected) this.sendMessage({ type: 'pong' });
        break;

      }

    }, (err) => console.error(err), () => console.log('Socket terminated'));
  }

  /**
   * Sets up listeners that handle an answer to an offer from the signaling server
   */
  private prepareForAnswer(): void {
    this.onAnswer().subscribe((answer) => {
      this.RTCconnected = true;
      this.connection.setRemoteDescription(new RTCSessionDescription(answer))
        .catch(err => console.error(err));
    });
  }

  /**
   * Sets up listeners that handles ICE a response from the signaling server with ICE candidates
   */
  private prepareForCandidate(): void {
    this.onCandidate().subscribe((candidate) => {
      this.connection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(err => console.error(err));
    });
  }

  private closeConnections(): void {
    this.connection.close();
    this.dataChannel.close();
  }

  private onCandidate(): Subject<RTCIceCandidateInit> {
    return this.socketEvents.candidate;
  }

  private receiveMessage(message: string): void {
    this.RTCMessage.next(message);
  }

  private onMessage(): Subject<any> {
    return this.socketEvents.message;
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