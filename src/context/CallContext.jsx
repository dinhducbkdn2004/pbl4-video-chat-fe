import { Avatar, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../hooks/useSocket';
import { authSelector } from '../redux/features/auth/authSelections';
import { useSetDataOneToOneRoom } from '../hooks/useSetDataOneToOneRoom';

export const CallContext = createContext();

export const CallContextProvider = ({ children }) => {
    const { socket } = useSocket();
    const { user: currentUser } = useSelector(authSelector);
    const setData = useSetDataOneToOneRoom();
    const [chatRoomData, setChatRoomData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const audioRef = useRef(null);

    const cancelCall = useCallback(() => {
        socket?.emit('callee:cancel_call', {
            chatRoomId: chatRoomData.chatRoom._id,
            message: `${currentUser.name} declined the call`
        });
        audioRef.current && audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsModalOpen(false);
    }, [socket, chatRoomData?.chatRoom?._id, currentUser?.name]);

    const handleButtonStart = useCallback(() => {
        const baseUrl = window.location.origin;
        const videoCallUrl = `${baseUrl}/video-call/${chatRoomData.chatRoom._id}?type=answer`;
        audioRef.current && audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsModalOpen(false);

        window.open(videoCallUrl, '_blank');
    }, [chatRoomData]);

    useEffect(() => {
        socket?.on('server:send_new_call', ({ from, chatRoom }) => {
            console.log('new video call', { chatRoom, from });
            setChatRoomData({ chatRoom, from });

            setIsModalOpen(true);
            audioRef.current.play();
        });

        return () => {
            socket?.off('server:send_new_call');
        };
    }, [socket, currentUser, setData]);

    return (
        <CallContext.Provider value={{ chatRoomData }}>
            <audio src='/sounds/thongbao-cuocgoi.mp3' ref={audioRef} loop />
            {chatRoomData && (
                <Modal
                    title='Incoming Call'
                    open={isModalOpen}
                    footer={null}
                    onCancel={cancelCall}
                    className='text-center'
                >
                    <div className='flex flex-col items-center'>
                        {chatRoomData.chatRoom.typeRoom === 'OneToOne' && (
                            <>
                                <Avatar src={chatRoomData.from.avatar} size={64} className='mb-4' />
                                <h2 className='text-lg font-semibold'>{`${chatRoomData.chatRoom.name} is calling you`}</h2>
                            </>
                        )}
                        {chatRoomData.chatRoom.typeRoom === 'Group' && (
                            <>
                                <Avatar src={chatRoomData.chatRoom.chatRoomImage} size={64} className='mb-4' />
                                <h2 className='text-lg font-semibold'>{`${chatRoomData.from.name} is starting a call in ${chatRoomData.chatRoom.name}`}</h2>
                            </>
                        )}
                        <div className='mt-4 flex gap-4'>
                            <Button type='primary' onClick={handleButtonStart} className='bg-blue-500 text-white'>
                                Answer
                            </Button>
                            <Button type='danger' onClick={cancelCall} className='bg-red-500 text-white-default'>
                                Decline
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            {children}
        </CallContext.Provider>
    );
};

CallContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
