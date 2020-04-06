import React, { useState, useEffect, useRef, useCallback } from "react";
import { socket } from "./App";
import Message from "./Message";

export default function Chat({ userName }) {
	const mesageInput = useRef("");
	const [textMessage, settextMessage] = useState("");
	const [messages, setmessages] = useState([]);

	useEffect(() => {
		socket.on("messages", (data) => {
			setmessages(data);
			document.querySelector(".room-chat").scrollTo(0, document.body.scrollHeight);
		});
	}, []);

	const handlerMessage = useCallback(
		(e) =>
			(() => {
				e.preventDefault();
				if (!textMessage) return;
				const dateOptions = {
					hour: "numeric",
					minute: "numeric",
					second: "numeric",
				};
				const date = new Date().toLocaleString("ru", dateOptions);
				socket.emit("new message", { id: new Date(), message: textMessage, name: userName, date });
				settextMessage("");
			})(),
		[]
	);

	return (
		<main>
			<div className="room-chat">
				{messages.map((i) => (
					<Message key={i.id} message={i} />
				))}
			</div>
			<div className="send-inchat">
				<form onSubmit={handlerMessage}>
					<input type="text" value={textMessage} onChange={(e) => settextMessage(e.target.value)} ref={mesageInput} />
				</form>
			</div>
		</main>
	);
}
