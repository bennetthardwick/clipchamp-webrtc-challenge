// Tutorials Point Signalling Server: https://www.tutorialspoint.com/webrtc/webrtc_signaling.htm

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 9090 });

let users = {};

wss.on('connection', (connection) => {

  connection.send(JSON.stringify({ "hey": "hey" }));

  connection.on('message', (message) => {

    if(message === "undefined") return;

    console.log(message);

    let data;
    let remoteConnection;

    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log('Invalid JSON');
      data = {};
    }

    switch (data.type) {
      case 'login':

        if (users[data.name]) {
          connection.send(JSON.stringify({ type: 'login', success: false }));       
        } else {
          users[data.name] = connection;
          connection.name = data.name;
          connection.send(JSON.stringify({ type: 'login', success: true }));
        }

        break;

      case 'offer':

        console.log(users[data.name]);

        remoteConnection = users[data.name];

        if (remoteConnection) {
          console.log("message sent");
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

      case 'candidate':

        remoteConnection = users[data.name];

        if (remoteConnection) {
          connection.otherName = data.name;
          remoteConnection.send(JSON.stringify({ type: 'candidate', candidate: data.candidate }));
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

      if (connection.otherName) {
        let remoteConnection = users[connection.otherName];
        remoteConnection.otherName = null;
        remoteConnection.send(JSON.stringify({ type: 'leave' }));
      }

    }

  });

});