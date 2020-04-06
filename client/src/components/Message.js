import React from "react";

export default function Message(props) {
	const { name, date, message } = props.message;
	return (
		<div className="message">
			<p className="message-info">
				{name} <small>в {date}</small>
			</p>
			<p>{message}</p>
		</div>
	);
}
