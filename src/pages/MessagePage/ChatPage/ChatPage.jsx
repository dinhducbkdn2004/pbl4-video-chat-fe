import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '../../../components/ChatPage/Header';
import MessageInput from '../../../components/ChatPage/MessageInput';
import MessageList from '../../../components/ChatPage/MessageList';
import ChatInfoSidebar from '../../../components/ChatInfoSidebar';
import { useParams, useLocation } from 'react-router-dom';
import RoomChatApi from '../../../apis/RoomChatApi';
import useFetch from '../../../hooks/useFetch';
import './ChatPage.css';

const ChatPage = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [chatInfo, setChatInfo] = useState(null);
    const { chatRoomId } = useParams();
    const { fetchData } = useFetch({ showError: false, showSuccess: false });
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setChatInfo(location.state);
        } else {
            getAllChatRoom();
        }
    }, [chatRoomId, location.state]);

    const getAllChatRoom = async () => {
        const { data, isOk } = await fetchData(() => RoomChatApi.getAllChatrooms());
        if (isOk) {
            const chatRoom = data.find((room) => room._id === chatRoomId);
            if (chatRoom) setChatInfo(chatRoom);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    return (
        <div className='flex h-screen flex-col'>
            <Header chatInfo={chatInfo} toggleSidebar={toggleSidebar} />
            <MessageList />
            <MessageInput />
            <ChatInfoSidebar chatInfo={chatInfo} open={isSidebarVisible} onClose={toggleSidebar} />
        </div>
    );
};

export default ChatPage;