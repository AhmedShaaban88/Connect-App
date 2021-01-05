import io from 'socket.io-client'
import {getFromLocalStorage} from "../helper/storage";

const DashboardSocket = io('https://connect-app-v1.herokuapp.com/dashboard',
    { transports: ['websocket'], query: {token: getFromLocalStorage('userData').token}, reconnectionAttempts: 10 });

export default DashboardSocket;