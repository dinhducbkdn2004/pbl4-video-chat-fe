import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import RoomChatApi from '../../apis/RoomChatApi';
import { sortMessagesByTime } from '../../helpers/utils';
import useFetch from '../../hooks/useFetch';
import { useSocket } from '../../hooks/useSocket';
import MessageComponent from '../MessageComponent';

const MessageList = ({ messages, messagesEndRef, handleSetMessages }) => {
    const location = useLocation();

    const { participants: members } = location.state;
    const { socket } = useSocket();
    const { chatRoomId: currentChatRoomId } = useParams();
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
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
            const { data, isOk } = await fetchData(() => RoomChatApi.getChatRoomById(currentChatRoomId, 1, 20));

            if (isOk) handleSetMessages(sortMessagesByTime(data));
            console.log(data);
        })();
    }, [currentChatRoomId, handleSetMessages, fetchData]);

    if (isLoading)
        return (
            <div className='flex h-full items-center justify-center'>
                <Spin size='medium' className='custom-spinner' />
            </div>
        );

    return (
        <div className='bg-white custom-scroll flex-1 overflow-y-auto p-5'>
            {messages.map((msg) => (
                <MessageComponent msg={msg} key={msg._id} members={members} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
MessageList.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    messagesEndRef: PropTypes.shape({
        current: PropTypes.instanceOf(Element)
    }).isRequired,
    handleSetMessages: PropTypes.func.isRequired
};
export default MessageList;
