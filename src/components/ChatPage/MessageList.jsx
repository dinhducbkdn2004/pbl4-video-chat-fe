import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import RoomChatApi from '../../apis/RoomChatApi';
import useFetch from '../../hooks/useFetch';
import { useSocket } from '../../hooks/useSocket';
import MessageComponent from '../MessageComponent';
import { useState, useEffect, useRef, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const MessageList = () => {
    const { socket } = useSocket();
    const { chatRoomId: currentChatRoomId } = useParams();
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

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

    const fetchMoreMessages = async () => {
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
    };

    const groupMessages = (messages) => {
        const groupedMessages = [];
        let currentGroup = [];
        messages.forEach((msg, index) => {
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
                <Spin size='small' className='custom-spinner' />
            </div>
        );

    const groupedMessages = groupMessages(messages);

    return (
        <div id='scrollable-div' className='bg-white flex flex-1 flex-col-reverse overflow-auto p-5'>
            <InfiniteScroll
                className='flex flex-col-reverse'
                dataLength={messages?.length || 0}
                next={fetchMoreMessages}
                hasMore={hasMore}
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
            </InfiniteScroll>
        </div>
    );
};

MessageList.propTypes = {};
export default MessageList;
