import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '../../../components/ChatPage/Header';
import MessageInput from '../../../components/ChatPage/MessageInput';
import MessageList from '../../../components/ChatPage/MessageList';
import ChatInfoSidebar from '../../../components/ChatInfoSidebar';
import './ChatPage.css';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    return (
        <div className='flex h-screen flex-col'>
            <Header toggleSidebar={toggleSidebar} />
            <MessageList handleSetMessages={handleSetMessages} messages={messages} messagesEndRef={messagesEndRef} />
            <MessageInput />
            <ChatInfoSidebar open={isSidebarVisible} onClose={toggleSidebar} />
        </div>
    );
};

export default ChatPage;