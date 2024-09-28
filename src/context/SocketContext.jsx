import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { authSelector } from '../redux/features/auth/authSelections';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import notificationsApi from '../apis/notificationApi';
import { notification } from 'antd';
import envClient from '../env';
export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const { accessToken, user } = useSelector(authSelector);
    const [api, contextHolder] = notification.useNotification({
        showProgress: true
    });
    useEffect(() => {
        if (!accessToken) return;

        const socket = io(envClient.VITE_BASE_API_URL, {
            extraHeaders: {
                authorization: accessToken
            }
        });

        setSocket(socket);

        // Listen for connection
        socket.on('connect', () => {
            console.log('Socket connected: ');
        });

        if (user) {
            socket.on('online friends', (users) => {
                setOnlineUsers(users);
            });

            socket.on('new online friend', (newFriend) => {
                setOnlineUsers((prevUsers) => {
                    const isAlreadyOnline = prevUsers.some((user) => user._id === newFriend._id);
                    if (!isAlreadyOnline) {
                        return [...prevUsers, newFriend];
                    }
                    return prevUsers;
                });
            });

            socket.on('disconnect friend', (disconnectedFriend) => {
                setOnlineUsers((prevUsers) => prevUsers.filter((user) => user._id !== disconnectedFriend._id));
            });
        }

        socket.on('new notification', (data) => {
            api.info({
                message: 'Bạn có 1 thông báo mới!',
                description: data.message
            });

            setNotifications((pre) => [data, ...pre]);
        });
        return () => {
            socket.off('connect');
            socket.off('new notification');
            socket.off('online friends');
            socket.off('new online friend');
            socket.off('disconnect friend');
        };
    }, [accessToken, user]);
    useEffect(() => {
        (async () => {
            const { data, isOk } = await notificationsApi.getAll();
            if (isOk) setNotifications(data);
        })();
    }, [accessToken]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, notifications }}>
            {contextHolder}
            {children}
        </SocketContext.Provider>
    );
};

SocketContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
