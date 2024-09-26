import { useState, useEffect } from 'react';
import { List, Avatar, Input } from 'antd';
import { SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import OnlineUsers from '../../../components/ChatList/OnlineUsers';
import AddRoomModal from '../../../components/ChatList/AddRoomModal';
import useFetch from '../../../hooks/useFetch';
import RoomChatApi from '../../../apis/RoomChatApi';
import RecentChats from '../../../components/ChatList/RecentChats';
import './ChatList.css';

const debouncedSearch = debounce(async (value, fetchData, setSearchResults) => {
    const data = await fetchData(() => RoomChatApi.searchChatroomByName(value, true));
    if (data.isOk) setSearchResults(data.data);
}, 350);

const ChatList = () => {
    const navigate = useNavigate();
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: false, showError: false });
    const [searchValue, setSearchValue] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isAddRoomModalVisible, setIsAddRoomModalVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [recentChats, setRecentChats] = useState([]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        debouncedSearch(e.target.value, fetchData, setSearchResults);
    };

    const toggleSearchBar = () => {
        setShowSearchBar(!showSearchBar);
    };

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

    const handleChatClick = (chat) => {
        if (chat._id) navigate(`/message/${chat._id}`, { state: { roomName: chat.name, members: chat.participants } });
    };

    const fetchRecentChats = async () => {
        const data = await fetchData(() => RoomChatApi.getAllChatrooms());
        if (data.isOk) setRecentChats(data.data);
    };

    useEffect(() => {
        fetchRecentChats();
    }, []);

    return (
        <>
            {contextHolder}
            <div className='chat-list'>
                {/* All Chat */}
                <div className='header'>
                    <div className='title'>All Chats</div>
                    <div className='icons'>
                        <SearchOutlined className='icon' onClick={toggleSearchBar} />
                        <UsergroupAddOutlined className='icon' onClick={showAddRoomModal} />
                    </div>
                </div>

                {/* Search Input */}
                <div className={`search-bar ${showSearchBar ? 'show' : ''}`}>
                    <SearchOutlined className='search-icon' />
                    <Input
                        className='search-input'
                        placeholder='Search'
                        value={searchValue}
                        onChange={handleSearchChange}
                        autoFocus
                        allowClear
                    />
                </div>

                {/* Search Results */}
                {searchValue && (
                    <div className='search-results'>
                        <List
                            itemLayout='horizontal'
                            dataSource={searchResults}
                            renderItem={(item) => (
                                <List.Item className='list-item' key={item._id} onClick={() => handleChatClick(item)}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} className='avatar' />}
                                        title={
                                            <div className='meta'>
                                                <span className='title'>{item.name}</span>
                                            </div>
                                        }
                                        description={<span className='message'>{item.message}</span>}
                                    />
                                    {/* {item.unread > 0 && <div className='unread'>{item.unread}</div>} */}
                                </List.Item>
                            )}
                        />
                    </div>
                )}

                {/* Online Now */}
                <OnlineUsers />

                {/* Recent Chats */}
                <RecentChats recentChats={recentChats} handleChatClick={handleChatClick} />

                {/* Add Room Modal */}
                <AddRoomModal open={isAddRoomModalVisible} onCreate={handleAddRoom} onCancel={handleCancel} />
            </div>
        </>
    );
};

export default ChatList;
