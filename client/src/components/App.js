import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import io from "socket.io-client";

function App() {
	const [urlChannel, seturlChannel] = useState();
	const [userName, setuserName] = useState(localStorage.getItem("chatUserName"));

	return (
		<div className="App">
			{userName ? (
				<>
					<Sidebar userName={userName} urlChannel={urlChannel} />
					<Chat userName={userName} />
				</>
			) : (
				<Login setuserName={setuserName} seturlChannel={seturlChannel} />
			)}
		</div>
	);
}

export default App;
export const socket = io.connect("localhost");
