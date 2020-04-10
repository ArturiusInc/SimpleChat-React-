import React from "react";
import User from "./User";

function Room({ room, click, active }) {
	return (
		<li>
			<div className={`room ${active}`} onClick={() => click(room.roomName)}>
				<div className="room-name">{room.roomName}</div>
				<div className="user-count">{room.users.length}</div>
			</div>
			<div className="room room-users">
				<ul>
					{room.users.map((user) => (
						<User key={Object.entries(user)[0]} user={user} />
					))}
				</ul>
			</div>
		</li>
	);
}

export default React.memo(Room);
