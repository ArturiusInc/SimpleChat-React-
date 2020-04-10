import React, { useRef, useEffect, useState } from "react";
import { socket } from "./App";
import { withRouter } from "react-router-dom";

function Login({ setuserName, seturlChannel, history }) {
	const userNameInput = useRef();
	const [inputUserName, setinputUserName] = useState("");
	const errorText = {
		nameUsed: "Имя уже используеться в чате.",
		nameError: "Ваше поле не может быть меньше 1 буквы",
		nameTrue: "",
	};
	const [error, seterror] = useState(errorText.nameTrue);

	useEffect(() => {
		userNameInput.current.focus();
	}, []);

	useEffect(() => {
		socket.on("check user name", (data) => {
			if (data.type === "userIsUsed") {
				seterror(errorText.nameUsed);
			} else if (data.type === "userIsAdded") {
				localStorage.setItem("chatUserName", data.name);
				seturlChannel(history.location.pathname.replace("/", ""));
				setuserName(data.name);
			}
		});
	}, [seterror, errorText.nameUsed, setuserName, seturlChannel, history]);

	const setName = (e) => {
		setinputUserName(e.target.value);
	};

	const handlerCheckUserName = (e) => {
		e.preventDefault();
		if (inputUserName.length <= 1) {
			seterror(errorText.nameError);
		} else {
			seterror(errorText.nameTrue);
			socket.emit("check user name", inputUserName, history.location.pathname.replace("/", ""));
		}
	};
	return (
		<div className="login-wrapper">
			<div className="login-cloud">
				<div className="login-header">
					<h2>Login</h2>
				</div>
				{error && <p className="error">{error}</p>}
				<div className="login-form new-room">
					<form onSubmit={handlerCheckUserName}>
						<input type="text" value={inputUserName} onChange={setName} ref={userNameInput} />
						<button>Войти</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default withRouter(Login);
