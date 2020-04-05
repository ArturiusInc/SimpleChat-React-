import React, { useState, useEffect, useRef } from "react";
import { socket } from "./App";

export default function Chat({ userName }) {
	const mesageInput = useRef("");
	const [textMessage, settextMessage] = useState("");
	const [messages, setmessages] = useState([]);

	useEffect(() => {
		socket.on("messages", data => {
			setmessages(data);
			document.querySelector(".room-chat").scrollTo(0, document.body.scrollHeight);
		});
	}, []);

	const handlerMessage = e =>
		(() => {
			e.preventDefault();
			if (!textMessage) return;
			const dateOptions = {
				hour: "numeric",
				minute: "numeric",
				second: "numeric"
			};
			const date = new Date().toLocaleString("ru", dateOptions);
			socket.emit("new message", { id: new Date(), message: textMessage, name: userName, date });
			settextMessage("");
		})();

	return (
		<main>
			<div className="room-chat">
				{messages.map(message => (
					<div className="message" key={message.id}>
						<p className="message-info">
							{message.name} <small>в {message.date}</small>
						</p>
						<p>{message.message}</p>
					</div>
				))}
			</div>
			<div className="send-inchat">
				<form onSubmit={handlerMessage}>
					<input
						type="text"
						value={textMessage}
						onChange={e => {
							settextMessage(e.target.value);
						}}
						ref={mesageInput}
					/>
				</form>
			</div>
		</main>
	);
}
