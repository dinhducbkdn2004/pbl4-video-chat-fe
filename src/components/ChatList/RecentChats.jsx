import React from 'react';
import { List, Avatar, Divider, Badge, Tooltip } from 'antd';
import { BiMessageSquareDots } from 'react-icons/bi';
import { getLastName, truncateString } from '../../helpers/utils';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import { useSocket } from '../../hooks/useSocket';

const RecentChats = ({ recentChats, handleChatClick }) => {
    const { user: currentUser } = useSelector(authSelector);
    const { onlineUsers } = useSocket();
    const participants = recentChats.map((chat) => chat.participants);

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
                                item.typeRoom === 'OneToOne' ? (
                                    <Badge
                                        dot={true}
                                        color={
                                            item.participants.some((participant) =>
                                                onlineUsers.find((onlineUser) => onlineUser._id === participant._id)
                                            )
                                                ? '#52c41a'
                                                : '#ff4d4f'
                                        }
                                        offset={[-7, 36]}
                                    >
                                        <Avatar
                                            size='large'
                                            src={item.chatRoomImage}
                                            className='avatar'
                                            shape='circle'
                                        />
                                    </Badge>
                                ) : (
                                    <Tooltip title='Group Chat'>
                                        <Avatar
                                            size='large'
                                            src={item.chatRoomImage}
                                            className='avatar'
                                            shape='circle'
                                        />
                                    </Tooltip>
                                )
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
                                                ? getLastName(item.lastMessage.sender.name) + ':'
                                                : ''}
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
                    </List.Item>
                )}
            />
        </div>
    );
};

export default RecentChats;
