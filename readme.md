# Project13

Work in progress

## How to use

Click the link https://project13-app.herokuapp.com to start the app

For demo purposes login with<br/>
username: demo<br/>
password: demo<br/>
and click PLAY to start the game

Open another or multiple browser windows and login by clicking<br/>
"Sign in as a guest"<br/>
and click PLAY to join the game

Please keep all the browser windows visible in order for the game to update

## Technologies
React, Node.js, MongoDB, WebRTC, Socket.io, React-three-fiber, styled-components

## Design
Project13 is a browser real-time networked multiplayer game. It uses WebRTC DataChannel to transfer data between players (peers), and Socket.io as a backup where WebRTC connection can not be established.

One of the peers acts as a game server and other peers connect to this main peer. The main peer holds an authoritative state of the game and sends it regularly to all the other peers. The other peers only send key-down information to the main peer.

A player can create a user account, or sign in as a guest. A player with a user account can host a game, that is, to run the game as a game server.

The architecture comprises Frontend, Backend, Relay server, and a Database. Player login and other authorization use cases such as password reset are handled with REST API calls to Backend. WebRTC peer discovery and connection establishment signaling is handled via Backend with socket.io. The Backend holds a state of peers who have started the game and signals them to establish a connection with the main peer. If two peers fail to establish a WebRTC connection between each other, they will use the Relay server instead which relays the messages between them using socket.io.

If WebRTC connection is established, the regular game state messages and the key-down information will be transferred unordered using UDP as a transport substrate. If WebRTC connection can not be established, the messages are transferred in-order using TCP as a transport substrate, and via relay server.

Currently the game doesn't yet have many game-like features. The players can turn left and right, accelerate and decelerate , see each other if they are at the same area, and chat with each other. A player's score counts up steadily while playing. After quitting the game the score is saved into database (excluding guest players). More features are to follow.