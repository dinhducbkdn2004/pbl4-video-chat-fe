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

    const showModal = () => {
        setIsModalOpen(true);
    };

    const cancelCall = useCallback(() => {
        socket?.emit('callee:cancel_call', {
            chatRoomId: chatRoomData?._id,
            message: `${currentUser.name} không chấp nhận cuộc gọi`
        });
        audioRef.current && audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsModalOpen(false);
    }, [socket, chatRoomData?._id, currentUser?.name]);

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
            console.log('new video call', from, chatRoom);
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
                <Modal title='Cuộc gọi đến' open={isModalOpen} footer={null} onCancel={cancelCall}>
                    {chatRoomData.chatRoom.typeRoom === 'OneToOne' && (
                        <>
                            <Avatar src={chatRoomData.from.avatar} />
                            <h2>{`${chatRoomData.chatRoom.name} Đang gọi cho bạn`}</h2>
                        </>
                    )}
                    {chatRoomData.chatRoom.typeRoom === 'Group' && (
                        <>
                            <Avatar src={chatRoomData.chatRoom.chatRoomImage} />
                            <h2>{`${chatRoomData.from.name} đang bắt đầu 1 cuộc gọi trong phòng ${chatRoomData.chatRoom.name}`}</h2>
                        </>
                    )}

                    <Button onClick={handleButtonStart}>bắt máy</Button>
                    <Button onClick={cancelCall}>hủy bỏ</Button>
                </Modal>
            )}
            {children}
        </CallContext.Provider>
    );
};

CallContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
