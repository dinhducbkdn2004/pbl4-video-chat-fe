import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSocket } from '../../../hooks/useSocket';
import RoomChatApi from '../../../apis/RoomChatApi';
import useFetch from '../../../hooks/useFetch';
import { sortMessagesByTime } from '../../../helpers/utils';
import Header from '../../../components/ChatPage/Header';
import MessageList from '../../../components/ChatPage/MessageList';
import MessageInput from '../../../components/ChatPage/MessageInput';
import CallModal from '../../../components/ChatPage/CallModal';
import './ChatPage.css';

const ChatPage = () => {
    const { chatId } = useParams();
    const location = useLocation();
    const roomName = location.state?.roomName || 'Default Room Name';
    const members = location.state?.members || [];
    const { socket, currentUser } = useSocket();
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: false, showError: false });
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [isVideoCallModalVisible, setIsVideoCallModalVisible] = useState(false);
    const [isVoiceCallModalVisible, setIsVoiceCallModalVisible] = useState(false);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        (async () => {
            if (!chatId) {
                console.error('Chat ID is undefined or null:', chatId);
                return;
            }
            setIsLoadingMessages(true);
            const { data, isOk } = await fetchData(() => RoomChatApi.getChatRoomById(chatId, 1, 20));
            if (isOk) setMessages(sortMessagesByTime(data));
            setIsLoadingMessages(false);
        })();
    }, [chatId]);

    useEffect(() => {
        socket?.on('new message', (incomingMessage) => {
            setMessages((prevMessages) => sortMessagesByTime([...prevMessages, incomingMessage]));
        });

        return () => {
            socket?.off('new message');
        };
    }, [socket]);

    const handleSendMessage = async () => {
        if (!message) return;
        await fetchData(() => RoomChatApi.createMessage(message, chatId, 'Text', null));
        setMessage('');
    };

    const toggleModalVisibility = (modalType, isVisible) => {
        if (modalType === 'video') {
            setIsVideoCallModalVisible(isVisible);
        } else if (modalType === 'voice') {
            setIsVoiceCallModalVisible(isVisible);
        }
    };

    const handleEmojiClick = (event, emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className='flex h-screen flex-col'>
            {contextHolder}
            <Header
                roomName={roomName}
                members={members}
                showVideoCallModal={() => toggleModalVisibility('video', true)}
                showVoiceCallModal={() => toggleModalVisibility('voice', true)}
            />
            <MessageList
                messages={messages}
                members={members}
                currentUser={currentUser}
                isLoadingMessages={isLoadingMessages}
                messagesEndRef={messagesEndRef}
                chatId={chatId}
            />
            <MessageInput
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                handleEmojiClick={handleEmojiClick}
                isEmojiPickerVisible={isEmojiPickerVisible}
                setIsEmojiPickerVisible={setIsEmojiPickerVisible}
            />
            <CallModal
                title='Video Call'
                isVisible={isVideoCallModalVisible}
                handleOk={() => toggleModalVisibility('video', false)}
                handleCancel={() => toggleModalVisibility('video', false)}
            >
                <p>Video call content goes here...</p>
            </CallModal>
            <CallModal
                title='Voice Call'
                isVisible={isVoiceCallModalVisible}
                handleOk={() => toggleModalVisibility('voice', false)}
                handleCancel={() => toggleModalVisibility('voice', false)}
            >
                <p>Voice call content goes here...</p>
            </CallModal>
        </div>
    );
};

export default ChatPage;
