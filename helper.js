const users = {};
const rooms = ["defaultChannel"];
const roomMessages = {};

function chekUserName(socket, userName) {
	if (Object.values(users).find((i) => i === userName)) {
		socket.emit("check user name", { type: "userIsUsed" });
	} else {
		socket.emit("check user name", { type: "userIsAdded", name: userName });
	}
}
function addRoom(roomName) {
	rooms.push(roomName);
}

function addUser(socketId, name) {
	users[socketId] = name;
}

function removeUser(socket) {
	console.log(`"${users[socket.id]}" disconnected from ???? channel`);
	delete users[socket.id];
}

function complex(io, socket, room, userName) {
	addUser(socket.id, userName);
	Object.keys(io.sockets.adapter.rooms).forEach((i) => socket.leave(i));
	socket.join(room);
	sendMessagesInRoom(io, room);
	getRoomsAndUsers(io);
}

// TODO: сделать синхронизацию с базой данных вместо памяти?
function sendMessagesInRoom(io, room) {
	io.in(room).emit("messages", roomMessages[room] ? roomMessages[room] : []);
}

function getRoomsAndUsers(io) {
	const allRoomsAndUsers = rooms.map((roomName) => {
		if (io.sockets.adapter.rooms[roomName]) {
			const usersId = Object.keys(io.sockets.adapter.rooms[roomName].sockets);
			const usersArr = usersId.map((id) => ({ id: users[id] }));
			return { roomName, users: usersArr };
		} else {
			return { roomName, users: [] };
		}
	});
	io.emit("get rooms and users", allRoomsAndUsers);
}

function addNewMessageInRoom(message, socket, io) {
	const userChannel = Object.entries(socket.rooms)[0][0];
	if (roomMessages[userChannel]) {
		roomMessages[userChannel] = roomMessages[userChannel].concat([message]);
	} else {
		roomMessages[userChannel] = [message];
	}
	io.in(userChannel).emit("messages", roomMessages[userChannel]);
}

module.exports = {
	removeUser,
	addRoom,
	addNewMessageInRoom,
	getRoomsAndUsers,
	chekUserName,
	complex,
};
