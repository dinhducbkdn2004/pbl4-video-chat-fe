import { List, Avatar, Divider, Badge, Tooltip } from 'antd';
import { BiMessageSquareDots } from 'react-icons/bi';
import { getLastName, truncateString } from '../../helpers/utils';
import { useSocket } from '../../hooks/useSocket';
import SkeletonChatItem from '../../components/SkeletonCustom/SkeletonChatItem';
import moment from 'moment';

const RecentChats = ({ recentChats, handleChatClick, isFirstLoad }) => {
    const { onlineUsers } = useSocket();

    const filteredChats = recentChats.filter((chat) => chat.lastMessage);

    return (
        <div className='body-chat'>
            <Divider orientation='left' className='divider bg-white-default' style={{ zIndex: 10 }}>
                <BiMessageSquareDots className='icon' />
                Recent Chat
            </Divider>
            <List
                itemLayout='horizontal'
                dataSource={isFirstLoad ? Array(5).fill({}) : filteredChats}
                renderItem={(item, index) =>
                    isFirstLoad ? (
                        <SkeletonChatItem key={index} />
                    ) : (
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
                                                    : '#B6B6B6'
                                            }
                                            offset={[-7, 36]}
                                        >
                                            <Avatar
                                                src={item.chatRoomImage}
                                                className='flex items-center justify-center object-cover'
                                                size={43}
                                            ></Avatar>
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
                                            {item.lastMessage?.sender.name && (
                                                <span className='text-gray-200 mr-1 font-bold'>
                                                    {getLastName(item.lastMessage.sender.name) + ':'}
                                                </span>
                                            )}
                                            {item.lastMessage?.content && (
                                                <span className={`text-gray ${!item.isRead ? 'font-sans' : ''}`}>
                                                    {truncateString(item.lastMessage.content, 17)}
                                                </span>
                                            )}
                                        </div>
                                        {item.lastMessage?.createdAt && (
                                            <span
                                                className='text-gray-500'
                                                style={{
                                                    fontSize: '11px'
                                                }}
                                            >
                                                {moment(item.lastMessage.createdAt).fromNow()}
                                            </span>
                                        )}
                                    </div>
                                }
                            />
                        </List.Item>
                    )
                }
            />
        </div>
    );
};

export default RecentChats;
