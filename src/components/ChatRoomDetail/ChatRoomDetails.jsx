import React, { useState } from 'react';
import { Avatar, Button, Menu, Input } from 'antd';
import { BellOutlined, SearchOutlined } from '@ant-design/icons';

const ChatRoomDetails = ({ chatRoomImage, roomName, stateOpenKeys, onOpenChange, items }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const handleMuteClick = () => {
        setIsMuted(!isMuted);
    };

    const handleSearchClick = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    return (
        <div className='flex flex-col items-center bg-white-default dark:bg-black-default dark:text-white-default'>
            <Avatar src={chatRoomImage} size={60} className='mt-3' />
            <h3 className='mt-3'>{roomName}</h3>
            <div className='mt-2 flex'>
                <Button
                    icon={<BellOutlined />}
                    className='dark:bg-gray-800 mb-2 mr-2 dark:text-white-default'
                    onClick={handleMuteClick}
                >
                    {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button
                    icon={<SearchOutlined />}
                    className='dark:bg-gray-800 dark:text-white-default'
                    onClick={handleSearchClick}
                >
                    Search
                </Button>
            </div>
            {isSearchVisible && <Input placeholder='Search...' className='mb-2 mt-2' />}
            <Menu
                className='bg-white-default dark:bg-black-default dark:text-white-default'
                mode='inline'
                defaultSelectedKeys={['1-1']}
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                style={{ width: '100%' }}
                items={items}
            />
        </div>
    );
};

export default ChatRoomDetails;
