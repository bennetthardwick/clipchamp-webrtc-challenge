import { Injectable } from '@angular/core';

@Injectable()
export class ChatService {

  private connections = [];

  constructor() { }

  public sendMessage(channel: RTCDataChannel, message: string) {
    channel.send(message);
  }

  findChannelByUserId(user: string): RTCDataChannel {
    return null;
  }

  createConnection(): RTCPeerConnection {
    return new RTCPeerConnection(null);
  }

  createDataChannel(connection: RTCPeerConnection): RTCDataChannel {
    return connection.createDataChannel("send", null);
  }

  connectConnections(local: RTCPeerConnection, remote: RTCPeerConnection): void {

    local.onicecandidate = (event) => {
      remote.addIceCandidate(event.candidate);
    };

    remote.onicecandidate = (event) => {
      local.addIceCandidate(event.candidate);
    }

  }

  createRecvCallback(connection: RTCPeerConnection) {
    connection.ondatachannel = (event) => {
      let channel = event.channel;
      channel.onmessage = (event) => console.log(event.data);
      channel.onopen = (event) => console.log('opened');
      channel.onclose = (event) => console.log('closed');
    }
  }

}

function onStateChange(e) {
  console.log('State change... :', e);
}
