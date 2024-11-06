import React from 'react';
import { Avatar, Button, Menu } from 'antd';
import { BellOutlined, SearchOutlined } from '@ant-design/icons';

const ChatRoomDetails = ({ chatRoomImage, roomName, stateOpenKeys, onOpenChange, items }) => (
    <div className='flex flex-col items-center'>
        <Avatar src={chatRoomImage} size={60} className='mt-3' />
        <h3 className='mt-3'>{roomName}</h3>
        <div className='mt-2 flex'>
            <Button icon={<BellOutlined />} className='mb-2 mr-2'>
                Tắt thông báo
            </Button>
            <Button icon={<SearchOutlined />}>Tìm kiếm</Button>
        </div>
        <Menu
            mode='inline'
            defaultSelectedKeys={['1-1']}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            style={{ width: '100%' }}
            items={items}
        />
    </div>
);

export default ChatRoomDetails;