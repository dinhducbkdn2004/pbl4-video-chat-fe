import { useState, useCallback, useEffect } from 'react';
import { List, Avatar, Divider, Input } from 'antd';
import { SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { BiMessageSquareDots } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import './ChatList.scss';
import OnlineUsers from '../../../components/ChatList/OnlineUsers';
import AddRoomModal from '../../../components/ChatList/AddRoomModal';
import useFetch from '../../../hooks/useFetch';
import RoomChatApi from '../../../apis/RoomChatApi';

const debouncedSearch = debounce(async (value, fetchData, setSearchResults) => {
    try {
        const data = await fetchData(() => RoomChatApi.searchChatroomByName(value, true));
        if (data.isOk) {
            setSearchResults(data.data);
            console.log('Search Results:', data.data);
        }
    } catch (error) {
        console.log('Search Error:', error);
    }
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
        console.log('New Room Data:', values);
        try {
            const data = await fetchData(() => RoomChatApi.createChatRoom(values.members, values.roomName));
            if (data.isOk) {
                console.log('Add Room Success:', data.data);
            }
        } catch (error) {
            console.log('Add Room Failed:', error);
        }
        setIsAddRoomModalVisible(false);
    };

    const handleCancel = () => {
        setIsAddRoomModalVisible(false);
    };

    const handleChatClick = (chat) => {
        if (chat._id) {
            navigate(`/message/${chat._id}`, { state: { roomName: chat.name, members: chat.participants } });
        } else {
            console.error('Chat ID is undefined or null:', chat);
        }
    };

    useEffect(() => {
        const fetchRecentChats = async () => {
            try {
                const data = await fetchData(() => RoomChatApi.getAllChatrooms());
                if (data.isOk) {
                    setRecentChats(data.data);
                    console.log('Recent Chats:', data.data);
                }
            } catch (error) {
                console.log('Fetch Recent Chats Error:', error);
            }
        };

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

                {/* Body Chat */}
                <div className='body-chat'>
                    {/* Recent Chat */}
                    <Divider orientation='left' className='divider'>
                        <BiMessageSquareDots className='icon' />
                        Recent Chat
                    </Divider>
                    <List
                        itemLayout='horizontal'
                        dataSource={recentChats}
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
                                {item.unread > 0 && <div className='unread'>{item.unread}</div>}
                            </List.Item>
                        )}
                    />
                </div>

                {/* Add Room Modal */}
                <AddRoomModal open={isAddRoomModalVisible} onCreate={handleAddRoom} onCancel={handleCancel} />
            </div>
        </>
    );
};

export default ChatList;
