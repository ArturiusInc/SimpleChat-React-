import React, { useEffect, useState, useCallback } from "react";
import { socket } from "./App";
import Room from "./Room";
import { withRouter } from "react-router-dom";

function Sidebar({ userName, history, urlChannel }) {
	const [roomsAndUsers, setroomsAndUsers] = useState([]);
	const [newRoomName, setnewRoomName] = useState("");
	const [newRoomIsExist, setnewRoomIsExist] = useState(false);
	const [channel, setChannel] = useState();

	useEffect(() => {
		if (userName) {
			if (urlChannel) {
				history.push(urlChannel);
				setChannel(urlChannel);
			} else {
				history.push("defaultChannel");
				setChannel("defaultChannel");
			}
		}
	}, [userName, history, urlChannel]);

	useEffect(() => {
		if (channel) {
			history.push(channel);
			socket.emit("enter channel", channel, userName);
		}
	}, [channel, userName]);

	useEffect(() => {
		socket.on("get rooms and users", (data) => {
			setroomsAndUsers(data);
		});
	}, []);

	const handlerNewRoomName = useCallback((e) => {
		setnewRoomName(e.target.value);
	}, []);

	const handlerSendRoomName = useCallback(
		(e) => {
			e.preventDefault();
			if (newRoomName) {
				if (!roomsAndUsers.find((room) => room.roomName === newRoomName)) {
					setnewRoomIsExist(false);
					socket.emit("new room", newRoomName);
					setnewRoomName("");
				} else {
					setnewRoomIsExist(true);
				}
			}
		},
		[newRoomName, roomsAndUsers]
	);

	const handleChangeRoom = useCallback(
		(newRoomName) => {
			if (channel !== newRoomName) setChannel(newRoomName);
		},
		[channel]
	);

	return (
		<div className="sidebar">
			<aside>
				<h3>Комнаты</h3>
				<nav className="rooms">
					<ul>
						{roomsAndUsers.map((room) => (
							<Room
								key={room.roomName}
								active={room.roomName === channel && "active"}
								room={room}
								click={handleChangeRoom}
							/>
						))}
					</ul>
				</nav>
			</aside>
			<aside className="new-room">
				<h3>Создать комнату</h3>
				{newRoomIsExist && <p className="error exist">Комната уже существует</p>}
				<form onSubmit={handlerSendRoomName}>
					<input type="text" value={newRoomName} onChange={handlerNewRoomName} />
					<button>Создать</button>
				</form>
			</aside>
		</div>
	);
}

export default withRouter(Sidebar);
