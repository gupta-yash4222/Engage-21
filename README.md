# ENGAGE-21

Welcome to this **ENGAG**ing video-chat application developed as a part of the **Microsoft Engage 2021** program.\
This Video-chat application is developed using `Peer.js` (a wrapper of `WebRTC` for smooth implementation of `peer-to-peer` calling), `Socket.io`, `Express.js` and `Node.js`

## Getting Started

For running the application on your local system, you require to clone this repository and follow the following steps - 

1. Run `npm install` in terminal to install the dependencies used in the project
2. Run `nodemon app.js` in terminal to start the server of the app

And after this you will have the app successfully working on your local machine.
The server is hosted on `port` 3000 and hence to launch the app you will have to go to `http://localhost:3000/` and you will good to go with the app. 

## Features in Video Call App

- Multiple Users can connect through the app.

- Toggling a user's audio stream (mute-unmute).
- Toggling a user's video stream (stopping-playing video).
- Screen Sharing
- User's can see the list of participants.
- Enabling screen recording through the record button. Recording can be paused and resumed through the pause-play button. 
- Participants can leave the meeting on clicking the leave meeting button
- Participants can chat among themselves using text-messages (Adapt Feature).
- When a user enters the room, there comes a notification in the chat-pane
- When a user leaves the room, there comes a notification in the chat-pane
- For new chats/notification there comes a new notification alert over the chat icon. 

## Online Demo

The application is hosted on Heroku Cloud Services. \
Link to web hosted application: [Engaging App](https://engaging-app.herokuapp.com/, "Engaging App") 


A detailed documentation can be accessed through this link: [Documentation](https://docs.google.com/presentation/d/1qIbruojMDEGyGXxoWxssLRzBxCkmcxLNeIJfDEJMmxQ/edit?usp=sharing, "Documentaion")
