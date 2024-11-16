import { List, Avatar, Divider, Badge, Tooltip, Spin } from 'antd';
import { BiMessageSquareDots } from 'react-icons/bi';
import { AiOutlineFile, AiOutlineVideoCamera, AiOutlinePicture } from 'react-icons/ai';
import { getLastName, truncateString } from '../../helpers/utils';
import { useSocket } from '../../hooks/useSocket';
import SkeletonChatItem from '../../components/SkeletonCustom/SkeletonChatItem';
import moment from 'moment';
import { useEffect, useRef } from 'react';
import { useSetDataOneToOneRoom } from '../../hooks/useSetDataOneToOneRoom';

const RecentChats = ({ recentChats, handleChatClick, isFirstLoad, loadMoreChats, loading }) => {
    const { onlineUsers } = useSocket();
    const lastChatElementRef = useRef();
    const setData = useSetDataOneToOneRoom();
    const filteredChats = recentChats
        .filter((chat) => chat.lastMessage)
        .map((chat) => {
            if (chat.typeRoom === 'OneToOne') {
                return setData(chat);
            }
            return chat;
        });
    // console.log('filteredChats', filteredChats);
    useEffect(() => {
        if (loading) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreChats();
            }
        });
        if (lastChatElementRef.current) {
            observer.observe(lastChatElementRef.current);
        }
        return () => {
            if (lastChatElementRef.current) {
                observer.unobserve(lastChatElementRef.current);
            }
        };
    }, [loading, loadMoreChats]);

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
                        <List.Item
                            className='list-item'
                            key={item._id}
                            onClick={() => handleChatClick(item)}
                            ref={index === filteredChats.length - 1 ? lastChatElementRef : null}
                        >
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
                                        <div className='flex items-center'>
                                            {item.lastMessage?.sender.name && (
                                                <span className='text-gray-200 mr-1 font-bold'>
                                                    {getLastName(item.lastMessage.sender.name) + ':'}
                                                </span>
                                            )}
                                            {item.lastMessage && (
                                                <span
                                                    className={`text-gray ${!item.isRead ? 'font-sans' : ''} flex items-center`}
                                                >
                                                    {item.lastMessage.type === 'Document' && (
                                                        <>
                                                            <AiOutlineFile
                                                                className='mr-1'
                                                                style={{ color: '#1890ff' }}
                                                            />
                                                            Đã gửi một file
                                                        </>
                                                    )}
                                                    {item.lastMessage.type === 'Video' && (
                                                        <>
                                                            <AiOutlineVideoCamera
                                                                className='mr-1'
                                                                style={{ color: '#f5222d' }}
                                                            />
                                                            Đã gửi một video
                                                        </>
                                                    )}
                                                    {item.lastMessage.type === 'Picture' && (
                                                        <>
                                                            <AiOutlinePicture
                                                                className='mr-1'
                                                                style={{ color: '#52c41a' }}
                                                            />
                                                            Đã gửi một ảnh
                                                        </>
                                                    )}
                                                    {!['Document', 'Video', 'Picture'].includes(
                                                        item.lastMessage.type
                                                    ) && truncateString(item.lastMessage.content, 17)}
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
            {loading && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <Spin />
                </div>
            )}
        </div>
    );
};

export default RecentChats;
