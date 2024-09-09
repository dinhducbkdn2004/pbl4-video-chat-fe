import React, { useState } from 'react';
import { List, Avatar, Typography, Divider, Dropdown, Space, Input, Menu } from 'antd';
import {
    SearchOutlined,
    MoreOutlined,
    DownOutlined,
    PlusOutlined,
    UsergroupAddOutlined,
    UserAddOutlined
} from '@ant-design/icons';

import { BiMessageSquareDots } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import './ChatList.scss';

const { Text } = Typography;

const onlineUsers = [
    { id: 1, avatar: 'https://via.placeholder.com/40' },
    { id: 2, avatar: 'https://via.placeholder.com/40' },
    { id: 3, avatar: 'https://via.placeholder.com/40' },
    { id: 4, avatar: 'https://via.placeholder.com/40' },
    { id: 5, avatar: 'https://via.placeholder.com/40' }
];

const recentChats = [
    {
        id: 1,
        name: 'Horace Keene',
        message: 'Have you called them',
        time: 'Just Now',
        avatar: 'https://via.placeholder.com/40',
        unread: 5
    },
    {
        id: 2,
        name: 'Hollie Tran',
        message: 'See you tomorrow',
        time: 'Yesterday',
        avatar: 'https://via.placeholder.com/40',
        unread: 0
    },
    {
        id: 3,
        name: 'Bryce Dillard',
        message: 'I will be there',
        time: 'Yesterday',
        avatar: 'https://via.placeholder.com/40',
        unread: 0
    },
    {
        id: 4,
        name: 'Maurice Brady',
        message: 'I am fine',
        time: 'Yesterday',
        avatar: 'https://via.placeholder.com/40',
        unread: 0
    },
    {
        id: 5,
        name: 'Lila Moss',
        message: 'I am fine',
        time: 'Yesterday',
        avatar: 'https://via.placeholder.com/40',
        unread: 0
    }
];

const ChatList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

    const handleMenuClick = (e) => {
        if (e.key === '3') {
            setOpen(false);
        }
    };

    const handleOpenChange = (nextOpen, info) => {
        if (info.source === 'trigger' || nextOpen) {
            setOpen(nextOpen);
        }
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const toggleSearchBar = () => {
        setShowSearchBar(!showSearchBar);
    };

    const toggleMoreDropdown = () => {
        setMoreDropdownOpen(!moreDropdownOpen);
    };

    const moreMenu = (
        <Menu>
            <Menu.Item key='1' icon={<PlusOutlined />}>
                New Chat
            </Menu.Item>
            <Menu.Item key='2' icon={<UsergroupAddOutlined />}>
                Create Group
            </Menu.Item>
            <Menu.Item key='3' icon={<UserAddOutlined />}>
                Invite Others
            </Menu.Item>
        </Menu>
    );

    const handleChatClick = (chat) => {
        navigate(`/message/userId=${chat.id}`);
    };

    const items = [
        {
            label: 'All Chat',
            key: '1'
        },
        {
            label: 'Archive Chat',
            key: '2'
        },
        {
            label: 'Pinned Chat',
            key: '3'
        }
    ];

    return (
        <div className='chat-list'>
            {/* All Chat */}
            <div className='header'>
                <Dropdown
                    menu={{
                        items,
                        onClick: handleMenuClick
                    }}
                    onOpenChange={handleOpenChange}
                    open={open}
                >
                    <a onClick={(e) => e.preventDefault()} className='dropdown-link'>
                        <Space>
                            All Chats
                            <DownOutlined className='down-icon' />
                        </Space>
                    </a>
                </Dropdown>
                <div className='icons'>
                    <SearchOutlined className='icon' onClick={toggleSearchBar} />
                    <Dropdown
                        overlay={moreMenu}
                        trigger={['click']}
                        visible={moreDropdownOpen}
                        onVisibleChange={setMoreDropdownOpen}
                        placement='bottomRight'
                    >
                        <MoreOutlined className='icon' onClick={toggleMoreDropdown} />
                    </Dropdown>
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

            {/* Online Now */}
            <div className='online-now'>
                <h4>Online Now</h4>
                <div className='avatars'>
                    {onlineUsers.map((user) => (
                        <Avatar key={user.id} src={user.avatar} className='avatar' />
                    ))}
                </div>
            </div>

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
                        <List.Item className='list-item' key={item.id} onClick={() => handleChatClick(item)}>
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} className='avatar' />}
                                title={
                                    <div className='meta'>
                                        <span className='title'>{item.name}</span>
                                        <span className='time'>{item.time}</span>
                                    </div>
                                }
                                description={<span className='message'>{item.message}</span>}
                            />
                            {item.unread > 0 && <div className='unread'>{item.unread}</div>}
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default ChatList;
