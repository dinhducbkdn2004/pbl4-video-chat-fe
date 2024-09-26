import { useCallback, useEffect, useRef, useState } from 'react';

import Header from '../../../components/ChatPage/Header';
import MessageInput from '../../../components/ChatPage/MessageInput';
import MessageList from '../../../components/ChatPage/MessageList';
import './ChatPage.css';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);

    const messagesEndRef = useRef(null);
    const handleSetMessages = useCallback((mewMessage) => {
        if (Array.isArray(mewMessage)) {
            setMessages(mewMessage);
            return;
        }

        setMessages((pre) => [...pre, mewMessage]);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className='flex h-screen flex-col'>
            <Header />
            <MessageList handleSetMessages={handleSetMessages} messages={messages} messagesEndRef={messagesEndRef} />
            <MessageInput />
        </div>
    );
};

export default ChatPage;
