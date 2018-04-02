# Reflection

### WebRTC Chat Challenge
Web Real-Time Communication (WebRTC), is an API found in modern browsers that enables peer-to-peer communication. In this project, I've used the WebRTC API and a websocket signaling server to enable two Angular2+ applications to communicate directly over a shared connection and exchange "chat" messages"

### How It Works
In order to create a WebRTC Peer Connection, each peer first needs to know where on the internet the other is. In order to do this I've used a Websocket server at a predictable location. While it is required to connect to this server in order to negotiate a peer-to-peer connection, after establishing one it's absolutely fine to disconnect from the signaling server.

After an `RTCPeerConnection` is established, the two applications communicate using an `RTCDataConnection`.

### Libraries
Apart from using Angular, the only external framework I used was RxJS (for Rx.Observable and Observable.Websocket.)
For this project, I decided it would be best to directly use the WebRTC exposed by the browser, instead of communicating through a layer of abstraction. 
Because of this, I would be required to better understand how the technology itself works, and would be better off afterwards.  

If I were to undertake this project again, I would use the library [DataChannel.js](https://www.webrtc-experiment.com/DataChannel/) if I was required to produce a chat only application, and [RTCMultiConnection](https://github.com/muaz-khan/RTCMultiConnection) for a video / audio / chat application.

### Structure
The structure of the application was largely decided by the `@angular/cli` tool created by Google for Angular. Following this structure, I used the chat service to handle state and interfacing between the signaling server and the WebRTC API.

### Conclusion
While the project wasn't with out issue, it went as well as it did thanks to the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) and [TutorialsPoint](https://www.tutorialspoint.com/webrtc/index.htm).
If I were to tackle this project again, I would focus on creating a more extensive abstraction of the WebRTC API. Currently, implementing features like connecting to more than one peer would take a lot of rewriting, as the `chat.service.ts` file is hard-coded to work with a single peer connection. This mainly came down to not having a complete understanding of how the technology worked exactly. 
Testing was another aspect of the project that was suppressed. While this was mainly due to having atypical testing requirements for Angular's build in testing suite, having stronger tests would have allowed more rapid development of the application. 
