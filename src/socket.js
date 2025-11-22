import {io} from "socket.io-client";
import API_BASE_URL from "./Config";

const socket = io(API_BASE_URL, {
    withCredentials: true,
    autoConnect: false,
});

export default socket;