import { UsergroupAddOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomChatApi from '../../../apis/RoomChatApi';
import AddRoomModal from '../../../components/ChatList/AddRoomModal';
import OnlineUsers from '../../../components/ChatList/OnlineUsers';
import RecentChats from '../../../components/ChatList/RecentChats';
import useFetch from '../../../hooks/useFetch';
import SearchBar from '../../../components/ChatList/SearchBar';
import { useSocket } from '../../../hooks/useSocket';
import './ChatList.css';
import { useSelector } from 'react-redux';
import { authSelector } from '../../../redux/features/auth/authSelections.js';

const ChatList = () => {
    const navigate = useNavigate();
    const { user } = useSelector(authSelector);
    const { fetchData } = useFetch({ showSuccess: false, showError: false });
    const { socket } = useSocket();
    const [isAddRoomModalVisible, setIsAddRoomModalVisible] = useState(false);
    const [recentChats, setRecentChats] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const audioRef = useRef(null);

    const showAddRoomModal = () => {
        setIsAddRoomModalVisible(true);
    };

    const handleAddRoom = async (values) => {
        await fetchData(() => RoomChatApi.createChatRoom(values.members, values.roomName, values.privacy));
        setIsAddRoomModalVisible(false);
    };

    const handleCancel = () => {
        setIsAddRoomModalVisible(false);
    };

    const handleChatClick = async (chatRoomData) => {
        await RoomChatApi.seenMessage(chatRoomData._id);

        setRecentChats((prevChats) =>
            prevChats.map((chat) => {
                if (chat._id === chatRoomData._id) {
                    if (!chat.lastMessage?.isRead?.some((reader) => reader._id === user._id)) {
                        return {
                            ...chat,
                            lastMessage: {
                                ...chat.lastMessage,
                                isRead: [...(chat.lastMessage.isRead || []), { _id: user._id }]
                            }
                        };
                    }
                }
                return chat;
            })
        );

        navigate(`/message/${chatRoomData._id}`, {
            state: chatRoomData
        });
    };

    const fetchAndSetChatrooms = async () => {
        setLoading(true);
        const data = await fetchData(() => RoomChatApi.getAllChatrooms(true, page));
        if (data.isOk) {
            setRecentChats((prevChats) => [...prevChats, ...data.data]);
            setHasMore(data.data.length > 0);
            if (isFirstLoad) setIsFirstLoad(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAndSetChatrooms();
    }, [page]);

    useEffect(() => {
        socket?.on('updated chatroom', (updatedChatRoom) => {
            if (user._id !== updatedChatRoom.lastMessage.sender._id) {
                audioRef?.current?.play();
            }

            setRecentChats((pre) => {
                const oleList = pre.filter((chatRoom) => chatRoom._id !== updatedChatRoom._id);
                return [updatedChatRoom, ...oleList];
            });
        });

        return () => {
            socket?.off('updated chatroom', fetchAndSetChatrooms);
        };
    }, [socket]);

    const loadMoreChats = () => {
        if (hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <>
            <audio src={'/sounds/tin-nhan.mp3'} ref={audioRef} />
            <div className='chat-list h-100vh rounded-md overflow-hidden bg-white-dark dark:bg-black-default'>
                <div className='header rounded-lg bg-white-default dark:bg-black-default'>
                    <div className='title text-blue'>All Chats</div>
                    <div className='icons'>
                        <UsergroupAddOutlined className='icon text-gray' onClick={showAddRoomModal} />
                    </div>
                </div>
                <SearchBar handleChatClick={handleChatClick} />
                <OnlineUsers recentChats={recentChats} handleChatClick={handleChatClick} />
                <RecentChats
                    user={user}
                    recentChats={recentChats}
                    handleChatClick={handleChatClick}
                    isFirstLoad={isFirstLoad}
                    loadMoreChats={loadMoreChats}
                    loading={loading}
                />
                <AddRoomModal open={isAddRoomModalVisible} onCreate={handleAddRoom} onCancel={handleCancel} />
            </div>
        </>
    );
};

export default ChatList;
