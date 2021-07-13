# ENGAGE-21

Welcome to this **ENGAG**ing video-chat application developed as a part of the **Microsoft Engage 2021** program.\
This Video-chat application is developed using `Peer.js` (a wrapper of `WebRTC` for smooth implementation of `peer-to-peer` calling), `Socket.io`, `Express.js` and `Node.js`

### Bug Fixes : 

1. `peer.on('call', ...)` not working i.e. peers are not able to connect with each other. To fix this I took help from this GitHub issue post : [peer.on('call',...) not working](https://github.com/WebDevSimplified/Zoom-Clone-With-WebRTC/issues/52#issuecomment-830641165)

2. While deploying the project one requires to run both peerjs and nodejs server and thus it becomes a bit hectic to use 2 terminals. For this I created a `PeerServer` working on `port: 3001, path: '/'`. I took help of this stackoverflow post: [Running peerjs server](https://stackoverflow.com/questions/26374931/how-to-create-and-run-my-own-peerjs-server)