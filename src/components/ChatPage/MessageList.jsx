import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import RoomChatApi from '../../apis/RoomChatApi';
import { sortMessagesByTime } from '../../helpers/utils';
import useFetch from '../../hooks/useFetch';
import { useSocket } from '../../hooks/useSocket';
import MessageComponent from '../MessageComponent';
import { useState, useEffect, useRef, useCallback } from 'react';

const MessageList = () => {
    const { socket } = useSocket();
    const { chatRoomId: currentChatRoomId } = useParams();
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    const handleSetMessages = useCallback((newMessage) => {
        if (Array.isArray(newMessage)) {
            setMessages(newMessage);
            return;
        }

        setMessages((prev) => [...prev, newMessage]);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        socket?.on('new message', (incomingMessage) => {
            if (incomingMessage.chatRoom === currentChatRoomId) handleSetMessages(incomingMessage);
        });

        return () => {
            socket?.off('new message');
        };
    }, [socket, currentChatRoomId, handleSetMessages]);

    useEffect(() => {
        (async () => {
            const { data, isOk } = await fetchData(() => RoomChatApi.getChatRoomById(currentChatRoomId, 1, 20));

            if (isOk) handleSetMessages(sortMessagesByTime(data));
        })();
    }, [currentChatRoomId, handleSetMessages, fetchData]);

    if (isLoading)
        return (
            <div className='flex h-full items-center justify-center'>
                <Spin size='medium' className='custom-spinner' />
            </div>
        );

    return (
        <div className='bg-white custom-scroll flex-1 overflow-y-auto p-5'>
            {messages.map((msg) => (
                <MessageComponent msg={msg} key={msg._id} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
MessageList.propTypes = {};
export default MessageList;
