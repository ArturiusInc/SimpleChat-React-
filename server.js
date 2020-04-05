const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const port = 80;
const users = {};
const rooms = ["defaultChannel"];
const roomMessages = {};

app.use(express.static(path.join(__dirname, "client", "public")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("check user name", (inputUserName) => {
		if (Object.values(users).find((i) => i === inputUserName)) {
			socket.emit("check user name", { type: "userIsUsed" });
		} else {
			users[socket.id] = inputUserName;
			socket.join("defaultChannel").emit("check user name", { type: "userIsAdded", name: inputUserName });
		}
	});

	socket.on("change room", (oldRoomName, newRoomName) => {
		socket.join(newRoomName, () => {
			socket.leave(oldRoomName, () => {
				getRoomsAndUsers();
				io.in(newRoomName).emit("messages", roomMessages[newRoomName] ? roomMessages[newRoomName] : []);
			});
		});
	});

	socket.on("get rooms and users", (userName) => {
		if (userName) {
			users[socket.id] = userName;
			socket.join("defaultChannel", () => {
				getRoomsAndUsers();
			});
		} else {
			getRoomsAndUsers();
		}
	});

	function getRoomsAndUsers() {
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

	socket.on("new room", (roomName) => {
		rooms.push(roomName);
		getRoomsAndUsers();
	});
	// TODO: сдулать синхронизацию с базой данных вместо памяти?
	socket.on("new message", (message) => {
		const userChannel = Object.entries(socket.rooms)[1][0];
		if (roomMessages[userChannel]) {
			roomMessages[userChannel] = roomMessages[userChannel].concat([message]);
		} else {
			roomMessages[userChannel] = [message];
		}
		io.in(userChannel).emit("messages", roomMessages[userChannel]);
	});

	socket.on("disconnect", (data) => {
		console.log(`a user ${users[socket.id]} disconnected from ???? channel`);
		delete users[socket.id];
		getRoomsAndUsers();
	});
});

http.listen(port, () => {
	console.log(`listening on ${port} port`);
});
