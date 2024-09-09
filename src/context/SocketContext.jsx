import { createContext, useEffect, useState } from 'react';

import io from 'socket.io-client';
import { authSelector } from '../redux/features/auth/authSelections';
import { store } from '../redux/store';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { accessToken } = useSelector(authSelector);

    useEffect(() => {
        if (!accessToken) return;

        const socket = io('http://localhost:3000', {
            extraHeaders: {
                authorization: accessToken
            }
        });
        setSocket(socket);

        // Listen for connection
        socket.on('connect', () => {
            console.log('Socket connected: ', socket.id);
        });
        socket.on('sever-send-friend-request', (e) => {
            console.log(e);
        });

        socket.on('getOnlineUsers', (users) => {
            setOnlineUsers(users);
        });
        return () => socket && socket.close();
    }, [accessToken]);

    return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

SocketContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
