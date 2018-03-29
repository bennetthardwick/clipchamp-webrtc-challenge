// Tutorials Point Signalling Server: https://www.tutorialspoint.com/webrtc/webrtc_signaling.htm

import * as _ from 'lodash';
import { Server as WebSocketServer } from 'ws';

let users = {};
let socketStarted = false;

// enableSocketDeadChecking();

export function Start(port: number) {

const wss = new WebSocketServer({ port: port });

wss.on('connection', (connection: any) => {
  
  socketStarted = true;

  connection.on('message', (message: string) => {

    console.log(message);

    let data;
    let remoteConnection;

    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log('Invalid JSON');
      data = {};
    }

    if (data.name) {
      data.name = data.name.toLowerCase();
      data.name = data.name.replace(/\s/g, '');
    }


    switch (data.type) {

      case 'lobby':
        connection.send(JSON.stringify({ type: 'lobby', data: Object.keys(users).filter(name => name !== connection.name) }));
      break;

      case 'login':

        if (users[data.name]) {
          connection.send(JSON.stringify({ type: 'login', success: false }));       
        } else {

          users[data.name] = connection;
          connection.name = data.name;
          connection.isFlaggedForDeletion = false;

          broadcastLobby();

          connection.send(JSON.stringify({ type: 'login', success: true }));
        }

        break;

      case 'offer':

        remoteConnection = users[data.name];

        if (remoteConnection) {
          connection.otherName = data.name;
          remoteConnection.send(JSON.stringify({ type: 'offer', offer: data.offer, name: connection.name }));
        }

      break;

      case 'answer':

        remoteConnection = users[data.name];

        if (remoteConnection) {
          connection.otherName = data.name;
          remoteConnection.send(JSON.stringify({ type: 'answer', answer: data.answer }));
        }

      break;

      case 'pong':

        if (users[connection.name])
          users[connection.name].isFlaggedForDeletion = false;

      break;

      case 'candidate':

        remoteConnection = users[data.name];

        if (remoteConnection) {
          connection.otherName = data.name;
          remoteConnection.send(JSON.stringify({ type: 'candidate', candidate: data.candidate, name: data.name }));
        }

      break;

      case 'leave':

        remoteConnection = users[data.name];

        if (remoteConnection) {
          remoteConnection.send(JSON.stringify({ type: 'leave' }));
        }

      break;

      default:

        connection.send(JSON.stringify({ type: 'error', message: 'Command not found: ' + data.type }));

      break;

    }

  });


  connection.on("close", () => {

    if (connection.name) {
      delete users[connection.name];

      let remoteConnection = users[connection.otherName];
      
      if (connection.otherName && remoteConnection) {
        remoteConnection.otherName = null;
        remoteConnection.send(JSON.stringify({ type: 'leave' }));
      }

    }

  });

});

function broadcastLobby() {
  wss.clients.forEach((conn: any) => {
    try {
      conn.send(JSON.stringify({ type: 'lobby', data: Object.keys(users).filter(name => name !== conn.name)}));
    } catch (e) {

    }
  });
}

/* function enableSocketDeadChecking() {

  let clearSockets = () => {

    if(socketStarted) {
      for (user in users) {
        if (users[user].isFlaggedForDeletion) {
          users[user].close();
          delete users[user];
        } else {
          users[user].send(JSON.stringify({ type: 'ping' }));
          users[user].isFlaggedForDeletion = true;
        }
      }

      broadcastLobby();
    }  
  }

  setInterval(clearSockets, 3000);

} */

}