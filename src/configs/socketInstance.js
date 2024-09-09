import { io } from 'socket.io-client';
import { authSelector } from '../redux/features/auth/authSelections';
import { store } from '../redux/store';

// Listen for disconnection
let socket;
export const initializeSocket = () => {
    const { accessToken } = store.getState(authSelector).auth;
 

    if (!accessToken) return;

    socket = io('http://localhost:3000', {
        extraHeaders: {
            authorization: accessToken
        }
    });
    // Listen for connection
    socket.on('connect', () => {
        console.log('Socket connected: ', socket.id);
    });
    socket.on('sever-send-friend-request', (e) => {
        console.log(e);
    });
    return socket;
};

export const getSocket = () => {
    return socket;
};
