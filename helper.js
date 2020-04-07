const users = {};
const rooms = ["defaultChannel"];
const roomMessages = {};

function addUser(socket, name) {
	users[socket.id] = name;
}

function removeUser(socket) {
	console.log(`a user ${users[socket.id]} disconnected from ???? channel`);
	delete users[socket.id];
}

function addRoom(roomName) {
	rooms.push(roomName);
}

function addNewMessageInRoom(message, socket, io) {
	const userChannel = Object.entries(socket.rooms)[1][0];
	if (roomMessages[userChannel]) {
		roomMessages[userChannel] = roomMessages[userChannel].concat([message]);
	} else {
		roomMessages[userChannel] = [message];
	}
	io.in(userChannel).emit("messages", roomMessages[userChannel]);
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

function chekUserName(socket, inputUserName) {
	if (Object.values(users).find((i) => i === inputUserName)) {
		socket.emit("check user name", { type: "userIsUsed" });
	} else {
		addUser((users, socket.id, inputUserName));
		socket.join("defaultChannel").emit("check user name", { type: "userIsAdded", name: inputUserName });
	}
}

// TODO: сдулать синхронизацию с базой данных вместо памяти?
function sendMessagesInRoom(io, newRoomName) {
	io.in(newRoomName).emit("messages", roomMessages[newRoomName] ? roomMessages[newRoomName] : []);
}

module.exports = {
	addUser,
	removeUser,
	addRoom,
	addNewMessageInRoom,
	getRoomsAndUsers,
	chekUserName,
	sendMessagesInRoom,
};
