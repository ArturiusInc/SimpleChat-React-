const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const port = 80;

const { removeUser, addRoom, addNewMessageInRoom, getRoomsAndUsers, chekUserName, complex } = require("./helper");

app.use(express.static(path.join(__dirname, "client", "public")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
	console.log("a user connected");
	socket.leave(socket.id);

	socket.on("new room", (roomName) => {
		addRoom(roomName);
		getRoomsAndUsers(io);
	});

	socket.on("check user name", (userName) => {
		chekUserName(socket, userName);
	});

	socket.on("enter channel", (room, userName) => {
		complex(io, socket, room, userName);
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
