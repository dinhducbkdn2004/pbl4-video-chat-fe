import React from 'react';
import { List, Avatar, Divider, Badge } from 'antd';
import { BiMessageSquareDots } from 'react-icons/bi';
import { getLastName } from '../../helpers/utils';
import { truncateString } from '../../helpers/utils';

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
                            description={
                                <div className='description flex items-center justify-between'>
                                    <div>
                                        <span className='text-gray-200 mr-1 font-bold'>
                                            {item.lastMessage?.sender.name
                                                ? getLastName(item.lastMessage.sender.name)
                                                : 'Unknown'}
                                            :
                                        </span>
                                        <span
                                            className='text-gray-600'
                                            style={{
                                                fontSize: '14px'
                                            }}
                                        >
                                            {truncateString(item.lastMessage?.content || 'No message available', 17)}
                                        </span>
                                    </div>
                                    <span
                                        className='text-gray-500'
                                        style={{
                                            fontSize: '11px'
                                        }}
                                    >
                                        {new Date(item.lastMessage?.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            }
                        />
                        {/* {item.unread > 0 && <div className='unread'>{item.unread}</div>} */}
                    </List.Item>
                )}
            />
        </div>
    );
};

export default RecentChats;
