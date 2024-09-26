import React from 'react';
import { List, Avatar, Divider, Badge } from 'antd';
import { BiMessageSquareDots } from 'react-icons/bi';

const RecentChats = ({ recentChats, handleChatClick }) => {
    return (
        <div className='body-chat'>
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
                            avatar={
                                <Badge dot color={item.isOnline ? '#52c41a' : 'red'} offset={[-5, 30]}>
                                    <Avatar src={item.chatRoomImage} className='avatar' />
                                </Badge>
                            }
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
    );
};

export default RecentChats;
