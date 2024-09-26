import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { authSelector } from '../redux/features/auth/authSelections';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { accessToken, user } = useSelector(authSelector);

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
            console.log('Socket connected: ');
        });

        socket.on('sever-send-friend-request', (e) => {
            console.log(e);
        });

        socket.off('new online friend');
        socket.off('disconnect friend');

        if (user) {
            socket.on('online friends', (users) => {
                setOnlineUsers(users.filter((onlineUser) => onlineUser.userId !== user?._id));
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
    }, [accessToken, user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, currentUser: user }}>{children}</SocketContext.Provider>
    );
};

SocketContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
