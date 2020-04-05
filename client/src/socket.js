import io from "socket.io-client";
const socket = io.connect("localhost");
export default socket;
