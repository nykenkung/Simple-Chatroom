const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: { origin: "*", methods: ["GET", "POST"] }
});
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

let messageHistory = [];
const HISTORY_LENGTH = 10;

io.on('connection', (socket) => {
	console.log('New Connecting (Socket.ID: ', socket.id, ')');

	let username = '';
	socket.on('new user', (name) => {
		username = name;
		socket.broadcast.emit('user connected', username);
		console.log(`NEW ${username} has joined the chat.`);
		socket.emit('history', messageHistory);
	});
    
    socket.on('user name change', (data) => {
        const oldUsername = username;
        username = data.newName;
        console.log(`RENAME: ${oldUsername} is now ${username}`);
        io.emit('user name updated', {
            old: oldUsername,
            new: username
        });
    });

	socket.on('chat message', (data) => {
		io.emit('chat message', data);
		console.log(`MSG ${data.username}: ${data.msg}`);

		messageHistory.push(data);
		if (messageHistory.length > HISTORY_LENGTH) messageHistory.shift();
	});

	socket.on('disconnect', () => {
		console.log('Disconnecting ( Socket.ID: ', socket.id, ')');
		if (username) {
			io.emit('user disconnected', username);
			console.log(`EXIT ${username} has left the chat.`);
		}
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { console.log(`The Client and Server Connection Web Application Server is running on http://localhost:${PORT}`); });