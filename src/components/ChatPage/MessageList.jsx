import { Spin, Avatar } from 'antd';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import RoomChatApi from '../../apis/RoomChatApi';
import useFetch from '../../hooks/useFetch';
import { useSocket } from '../../hooks/useSocket';
import MessageComponent from '../MessageComponent';
import { useState, useEffect, useRef, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import './MessageList.css';

const MessageList = () => {
    const { socket } = useSocket();
    const { chatRoomId: currentChatRoomId } = useParams();
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const { user: currentUser } = useSelector(authSelector);

    const handleSetMessages = useCallback((newMessage) => {
        if (Array.isArray(newMessage)) {
            setMessages(newMessage);
            return;
        }

        setMessages((prev) => [newMessage, ...prev]);
    }, []);

    useEffect(() => {
        socket?.on('new message', (incomingMessage) => {
            if (incomingMessage.chatRoom === currentChatRoomId) handleSetMessages(incomingMessage);
        });

        return () => {
            socket?.off('new message');
        };
    }, [socket, currentChatRoomId, handleSetMessages]);

    useEffect(() => {
        (async () => {
            const { data, isOk } = await fetchData(() => RoomChatApi.getChatRoomById(currentChatRoomId, 1, 10));

            if (isOk) handleSetMessages(data);
        })();
    }, [currentChatRoomId, handleSetMessages, fetchData]);

    useEffect(() => {
        setMessages([]);
        setHasMore(true);
        setPage(1);
    }, [currentChatRoomId]);

    useEffect(() => {
        if (!currentUser) return;

        socket?.on('sever:user-start-typing', ({ user, chatRoomId }) => {
            if (chatRoomId === currentChatRoomId && user._id !== currentUser._id) {
                setTypingUsers((prev) => {
                    if (!prev.some((u) => u._id === user._id)) {
                        return [...prev, user];
                    }
                    return prev;
                });
            }
        });
        socket?.on('sever:user-stop-typing', ({ user, chatRoomId }) => {
            if (chatRoomId === currentChatRoomId) {
                setTypingUsers((prev) => prev.filter((u) => u._id !== user._id));
            }
        });
        return () => {
            socket?.off('sever:user-start-typing');
            socket?.off('sever:user-stop-typing');
        };
    }, [socket, currentChatRoomId, currentUser]);

    const fetchMoreMessages = async () => {
        setIsFetchingMore(true);
        const nextPage = page + 1;
        const { data, isOk } = await fetchData(() => RoomChatApi.getChatRoomById(currentChatRoomId, nextPage, 10));
        if (isOk) {
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setMessages((prev) => [...prev, ...data]);
                setPage(nextPage);
            }
        }
        setIsFetchingMore(false);
    };

    const groupMessages = (messages) => {
        const groupedMessages = [];
        let currentGroup = [];
        messages.forEach((msg) => {
            if (currentGroup.length === 0 || currentGroup[0].sender._id === msg.sender._id) {
                currentGroup.push(msg);
            } else {
                groupedMessages.push([...currentGroup].reverse());
                currentGroup = [msg];
            }
        });

        if (currentGroup.length > 0) {
            groupedMessages.push([...currentGroup].reverse());
        }
        return groupedMessages;
    };
    if (isLoading && messages.length === 0)
        return (
            <div className='flex h-full items-center justify-center'>
                <Spin size='small' />
            </div>
        );
    else if (messages.length === 0)
        return (
            <div className='flex h-full items-center justify-center rounded-lg bg-white-default p-5 dark:bg-black-default dark:bg-black-light dark:text-white-default'>
                No messages
            </div>
        );

    const groupedMessages = groupMessages(messages);

    return (
        <>
            <div
                id='scrollable-div'
                className='flex flex-1 flex-col-reverse overflow-auto rounded-lg bg-white-default p-5 dark:bg-black-default dark:bg-black-light dark:text-white-default'
            >
                <InfiniteScroll
                    className='flex flex-col-reverse'
                    dataLength={messages?.length || 0}
                    next={fetchMoreMessages}
                    hasMore={hasMore}
                    loader={
                        <div className='my-1 flex justify-center'>
                            <Spin size='small' />
                        </div>
                    }
                    scrollableTarget='scrollable-div'
                    inverse={true}
                >
                    {groupedMessages.map((group, index) => (
                        <MessageComponent
                            messages={group}
                            key={index}
                            isFirstMessage={index === 0}
                            isLastMessage={index === groupedMessages.length - 1}
                        />
                    ))}
                    {!hasMore && (
                        <div className='flex justify-center text-gray'>
                            <span>Không còn tin nhắn cũ</span>
                        </div>
                    )}
                </InfiniteScroll>
            </div>
            {typingUsers.length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '110px',
                        left: '525px'
                    }}
                    className='flex items-center'
                >
                    {typingUsers.map((user) => (
                        <Avatar key={user._id} src={user.avatar} size='medium' className='mr-2' />
                    ))}
                    <div className='typing-indicator h-8 w-10 items-center justify-center rounded-2xl bg-white-dark dark:bg-gray'>
                        <span className='dot'></span>
                        <span className='dot'></span>
                        <span className='dot'></span>
                    </div>
                </div>
            )}
        </>
    );
};

MessageList.propTypes = {};
export default MessageList;
