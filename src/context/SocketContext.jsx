import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { authSelector } from '../redux/features/auth/authSelections';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { notificationsApi } from '../apis/notificationApi';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const { accessToken, user } = useSelector(authSelector);

    useEffect(() => {
        if (!accessToken) return;

        const socket = io(import.meta.env.VITE_BASE_API_URL_PRO, {
            extraHeaders: {
                authorization: accessToken
            }
        });

        setSocket(socket);

        // Listen for connection
        socket.on('connect', () => {
            console.log('Socket connected: ');
        });
        socket.on('sever-send-friend-request', (e) => {
            console.log(e);
        });
        if (user) {
            socket.on('online-users', (users) => {
                setOnlineUsers(users);
            });
        }
    }, [accessToken, user]);
    useEffect(() => {
        (async () => {
            const { data, isOk } = await notificationsApi.getAll();
            if (isOk) setNotifications(data);

            socket?.on('new notification', (data) => {
                setNotifications[(pre) => [data, ...pre]];
            });

            return () => {
                socket?.off('new notification');
            };
        })();
    }, [socket]);

    return <SocketContext.Provider value={{ socket, onlineUsers, notifications }}>{children}</SocketContext.Provider>;
};

SocketContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
