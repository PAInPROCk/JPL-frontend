import {io} from "socket.io-client";


const URL = process.env.APP_BASE_URL || "http://127.0.0.1:5000";
const socket = io(URL, {
    withCredentials: true,
    autoConnect: false,
});

export default socket;