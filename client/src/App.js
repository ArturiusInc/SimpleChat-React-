import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";

import io from "socket.io-client";
export const socket = io.connect("localhost");

function App() {
	const [userName, setuserName] = useState(localStorage.getItem("chatUserName"));
	return (
		<div className="App">
			{userName ? (
				<>
					<Sidebar userName={userName} />
					<Chat userName={userName} />
				</>
			) : (
				<Login setuserName={setuserName} />
			)}
		</div>
	);
}

export default App;
