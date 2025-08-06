# Client and Server Connection Web Application

### Project Overview  
Build a basic real-time chat application using Node.js. This project focuses on understanding Node.js server-side development, handling real-time connections, and implementing basic chat functionalities without the need for a database.

### Project Requirements
### Server-side:
- Create a Node.js server using the http module.
- Handle client connections, disconnections, and messages.
- Broadcast messages to all connected clients.
- Implement basic chat room functionality (optional).

### Client-side:
- Create a simple JavaScript-based chat interface.
- Implement message sending and receiving functionalities.
- Display chat messages in real-time.
   
## Installation & Start
1) Use Git clone this repository and locate the server directory:
```
git clone https://github.com/nykenkung/Simple-Chatroom.git
(Windows CMD) cd /d Simple-Chatroom/server
(Linux Terminal) cd Simple-Chatroom/server
```
2) Install Dependencies (Express, Socket.io) on Node.js project:
```
npm install express socket.io
```
3) Run the backend server:
```
node start
```
5) Open http://localhost:3000 to start the webpage:
```
(Windows CMD) start http://localhost:3000
(Linux Terminal) xdg-open http://localhost:3000
```
Optional: Run the backend server with nodemon development tool:
```
node run dev
```
If not installed nodemon development tool, install globally:
```
npm install -g nodemon
```
