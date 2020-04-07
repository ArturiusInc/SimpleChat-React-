const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const port = 80;

const {
	addUser,
	removeUser,
	addRoom,
	addNewMessageInRoom,
	getRoomsAndUsers,
	chekUserName,
	sendMessagesInRoom,
} = require("./helper");

app.use(express.static(path.join(__dirname, "client", "public")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
	console.log("a user connected");

	socket.on("check user name", (inputUserName) => {
		chekUserName(socket, inputUserName);
	});

	socket.on("change room", (oldRoomName, newRoomName) => {
		socket.join(newRoomName, () => {
			socket.leave(oldRoomName, () => {
				getRoomsAndUsers(io);
				sendMessagesInRoom(io, newRoomName);
			});
		});
	});

	socket.on("get rooms and users", (userName) => {
		if (userName) {
			addUser(socket, userName);
			socket.join("defaultChannel", () => {
				getRoomsAndUsers(io);
			});
		} else {
			getRoomsAndUsers(io);
		}
	});

	socket.on("new room", (roomName) => {
		addRoom(roomName);
		getRoomsAndUsers(io);
	});

	socket.on("new message", (message) => {
		addNewMessageInRoom(message, socket, io);
	});

	socket.on("disconnect", (data) => {
		removeUser(socket);
		getRoomsAndUsers(io);
	});
});

http.listen(port, () => {
	console.log(`listening on ${port} port`);
});
