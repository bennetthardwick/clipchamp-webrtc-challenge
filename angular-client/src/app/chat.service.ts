import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

@Injectable()
export class ChatService {

  private socket = Observable.webSocket('ws://localhost:9090');

  private connection: RTCPeerConnection;
  private dataChannel: RTCDataChannel;
  private receiveChannel: RTCDataChannel;

  private observables: SocketChatEvents = {};

  private otherName = "";

  constructor() { 
    this.prepareObservableSocket();
    this.prepareForAnswer();
    this.prepareForCandidate();
    this.prepareForOffer();

    this.onLogin().subscribe(success => {
      if (success === false) {
        console.log("Bugger..");
      } else {

        let config: RTCConfiguration = { iceServers: [{ urls: "stun:stun.1.google.com:19302"}]};
        this.connection = new RTCPeerConnection(config);

        this.connection.onicecandidate = (event) => {

          console.log(this.otherName);

          if (event.candidate) this.sendMessage({ type: 'candidate', candidate: event.candidate, name: this.otherName });
        };

        this.connection.ondatachannel = this.listenForDataChannel;

        this.openDataChannel();

      }
    })

  }

  createOfferTo(user: string): void {

    this.otherName = user;

    this.connection.createOffer()
      .then((offer) => { 
        this.sendMessage({ type: 'offer', offer: offer, name: user }); 
        this.connection.setLocalDescription(offer);
      }).catch((err) => console.log(err));
  }

  listenForDataChannel(event): void {
    this.receiveChannel = event.channel;
    this.receiveChannel.onmessage = (msg) => console.log(msg);
  }

  openDataChannel(): void {
    this.dataChannel = this.connection.createDataChannel("chat");
   

    console.log(this.dataChannel);

    this.dataChannel.onopen = () => this.dataChannel.send('heyyyy');
    this.dataChannel.onerror = (err) => console.error(err);
    this.dataChannel.onmessage = (msg) => console.log(msg);
  }

  prepareObservableSocket(): void {
    this.observables = {
      message: new Subject(),
      login: new Subject(),
      offer: new Subject(),
      candidate: new Subject(),
      answer: new Subject()
    };

    this.socket.subscribe((data: any) => {
      this.observables.message.next(data);

      console.log(data);

      switch (data.type) {
        case 'login':
          this.observables.login.next(data.success)
        break;

        case 'offer':
          this.observables.offer.next({ offer: data.offer, name: data.name })
        break;

        case 'candidate':
          this.observables.candidate.next(data.candidate);
        break;

        case 'answer':
          this.observables.answer.next(data.answer)
        break;

      }

    }, (err) => console.log(err), () => console.log('fin'));
  };

  sendMessage(message) {
    this.socket.next(JSON.stringify(message));
  }

  sendRTCMessage(message) {
    console.log("send");
    this.dataChannel.send(message);
  }

  login(name) {
    this.sendMessage(this.sendMessage({ type: 'login', name: name }));
  }

  prepareForOffer () {
    this.onOffer().subscribe((data) => {

      console.log("offer");

      this.otherName = data.name;

      this.connection.setRemoteDescription(new RTCSessionDescription(data.offer));
      this.connection.createAnswer()
        .then((answer) => {
          this.connection.setLocalDescription(answer);
          this.sendMessage({ type: 'answer', answer: answer, name: data.name });
        }).catch((err) => console.log(err));
    });
  }

  prepareForAnswer() {
    this.onAnswer().subscribe((answer) => {
      this.connection.setRemoteDescription(new RTCSessionDescription(answer));
    });
  }

  prepareForCandidate() {
    this.onCandidate().subscribe((candidate) => {

      console.log('got the candidate');
      console.log(this.otherName);

      this.connection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  private onCandidate() {
    return this.observables.candidate;
  }

  private onOffer() {
    return this.observables.offer;
  }

  private onAnswer() {
    return this.observables.answer;
  }

  private onLogin() {
    return this.observables.login;
  }

  private onMessage() {
    return this.observables.message;
  }

}

interface SocketChatEvents {
  message?: Subject<any>;
  login?: Subject<boolean>;
  offer?: Subject<{ offer: any, name: any}>;
  answer?: Subject<RTCSessionDescription>;
  candidate?: Subject<RTCIceCandidateInit>;
}

interface RTCChatEvents {
  message?: Subject<any>;
}

function onStateChange(e) {
  console.log('State change... :', e);
}