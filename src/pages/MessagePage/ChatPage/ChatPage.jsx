import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '../../../components/ChatPage/Header';
import MessageInput from '../../../components/ChatPage/MessageInput';
import MessageList from '../../../components/ChatPage/MessageList';
import ChatInfoSidebar from '../../../components/ChatInfoSidebar';
import { useParams, useLocation } from 'react-router-dom';
import RoomChatApi from '../../../apis/RoomChatApi';
import useFetch from '../../../hooks/useFetch';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../redux/features/auth/authSelections';
import './ChatPage.css';

const ChatPage = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [chatInfo, setChatInfo] = useState(null);
    const { chatRoomId } = useParams();
    const { fetchData } = useFetch({ showError: false, showSuccess: false });
    const { user: me } = useSelector(authSelector);
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

    const updateChatInfo = async () => {
        getAllChatRoom();
    };

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    return (
        <div className='flex ml-4 h-screen flex-col'>
            <Header chatInfo={chatInfo} me={me} toggleSidebar={toggleSidebar} />
            <MessageList />
            <MessageInput />
            <ChatInfoSidebar
                chatInfo={chatInfo}
                me={me}
                open={isSidebarVisible}
                onClose={toggleSidebar}
                updateChatInfo={updateChatInfo}
            />
        </div>
    );
};

export default ChatPage;