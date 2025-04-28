import { createContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { authSelector } from '../redux/features/auth/authSelections';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import notificationsApi from '../apis/notificationApi';
import { notification } from 'antd';
import envClient from '../env';
import useNotificationTitle from '../hooks/useNotificationTitle';
import { useCallback } from 'react';
export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const socketRef = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const { accessToken } = useSelector(authSelector);
    const [api, contextHolder] = notification.useNotification({
        showProgress: true
    });
    const audioRef = useRef(null);
    const connectSocket = useCallback(
        () =>
            io(import.meta.env.VITE_BASE_API_URL_SOCKET, {
                extraHeaders: {
                    authorization: accessToken
                },
                secure: import.meta.env.VITE_SOCKET_SECURE === 'true',
                rejectUnauthorized: false,
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            }),

        [accessToken]
    );

    useEffect(() => {
        if (!accessToken) return;

        const socket = connectSocket();
        socketRef.current = socket;
        console.log('Socket attempting connection to:', import.meta.env.VITE_BASE_API_URL_SOCKET);

        socket.on('connect', () => {
            console.log('Socket connected successfully');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });

        socket.on('online friends', (users) => {
            setOnlineUsers(users.filter((user) => user._id !== socket.id));
        });

        socket.on('new online friend', (newOnlineUser) => {
            setOnlineUsers((users) =>
                users.some((user) => user._id === newOnlineUser._id) ? users : [...users, newOnlineUser]
            );
        });

        socket.on('disconnect friend', (offlineUser) => {
            setOnlineUsers((users) => users.filter((user) => user._id !== offlineUser._id));
        });

        socket.on('new notification', (data) => {
            api.info({
                message: 'Bạn có 1 thông báo mới!',
                description: data.message
            });
            if (audioRef.current) {
                audioRef.current.play(); // Phát âm thanh khi có thông báo mới
            }
            setNotifications((pre) => [data, ...pre]);
        });

        return () => {
            socket.off('new notification');
            socket.off('online friends');
            socket.off('new online friend');
            socket.off('disconnect friend');
            socket.disconnect();
        };
    }, [accessToken, api, connectSocket]);

    useEffect(() => {
        (async () => {
            if (accessToken) {
                const { data, isOk } = await notificationsApi.getAll();
                if (isOk) setNotifications(data);
            }
        })();
    }, [accessToken]);

    useNotificationTitle(notifications);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers, notifications }}>
            <audio ref={audioRef} src='/sounds/notification.mp3' />
            {contextHolder}
            {children}
        </SocketContext.Provider>
    );
};

SocketContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
