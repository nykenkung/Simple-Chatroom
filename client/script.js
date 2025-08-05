document.addEventListener('DOMContentLoaded', () => {
	const socket = io();

	// --- DOM Elements ---
	const messages = document.getElementById('messages');
	const form = document.getElementById('form');
	const input = document.getElementById('input');
	const usernameModal = document.getElementById('username-modal');
	const usernameInput = document.getElementById('username-input');
	const joinChatButton = document.getElementById('join-chat');
	const currentUserDisplay = document.getElementById('current-user-display');

	let username = '';
	let isEditingUsername = false;

	// --- Functions ---
	const addMessage = (data, type) => {
		const item = document.createElement('li');
		item.classList.add(type);

		if (type === 'other-message' || type === 'user-message') {
			const usernameSpan = document.createElement('span');
			usernameSpan.className = 'username';
			usernameSpan.textContent = data.username + ': ';
			item.appendChild(usernameSpan);
		}
		
		const messageContent = document.createElement('span'); 
		messageContent.textContent = data.msg;
		item.appendChild(messageContent);
		
		messages.appendChild(item);
		messages.scrollTop = messages.scrollHeight;
	};

	// --- Event Listeners ---
	const joinChat = () => {
		const name = usernameInput.value.trim();
		if (name) {
			username = name;
			usernameModal.style.display = 'none';
			currentUserDisplay.textContent = username;
			socket.emit('new user', username);
			addMessage({ msg: `You have joined the chat as ${name}.` }, 'server-message');
			input.focus();
		}
	};

	joinChatButton.addEventListener('click', joinChat);
	usernameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') joinChat(); });

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		if (input.value && username) {
			const messageData = { username: username, msg: input.value };
			addMessage(messageData, 'user-message');
			socket.emit('chat message', messageData);
			input.value = '';
		}
	});

	currentUserDisplay.addEventListener('click', () => {
	if (isEditingUsername) return;

	isEditingUsername = true;
	const oldName = username;
	currentUserDisplay.innerHTML = '';

	const editInput = document.createElement('input');
	editInput.type = 'text';
	editInput.className = 'username-edit-input';
	editInput.value = oldName;

	const saveUsername = () => {
		const newName = editInput.value.trim();
		
		if (newName && newName !== oldName) {
		username = newName;
		currentUserDisplay.textContent = newName;
		socket.emit('user name change', { newName: newName });
		} else currentUserDisplay.textContent = oldName;
		isEditingUsername = false;
	};

	editInput.addEventListener('blur', saveUsername);
	editInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') editInput.blur();
	});

	currentUserDisplay.appendChild(editInput);
	editInput.focus();
	editInput.select();
	});

	// --- Socket.IO Event Handlers ---
	socket.on('chat message', (data) => { if (data.username !== username) addMessage(data, 'other-message'); });

	socket.on('user connected', (name) => { addMessage({ msg: `${name} has joined the chat.` }, 'server-message'); });
	
	socket.on('user name updated', (data) => { if (data.old !== username) addMessage({ msg: `${data.old} is now known as ${data.new}.` }, 'server-message'); });

	socket.on('user disconnected', (name) => { addMessage({ msg: `${name} has left the chat.` }, 'server-message'); });
	
	socket.on('history', (history) => {
		history.forEach(data => {
			if (data.username === username) addMessage(data, 'user-message');
			else addMessage(data, 'other-message');
		});
	});
});