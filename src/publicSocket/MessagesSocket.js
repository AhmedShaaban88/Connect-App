import io from 'socket.io-client'
import {getFromLocalStorage} from "../helper/storage";

const MessagesSocket = io('https://connect-app-v1.herokuapp.com/messages',
    { transports: ['websocket'], query: {token: getFromLocalStorage('userData')?.token}, reconnectionAttempts: 10 });

export default MessagesSocket;