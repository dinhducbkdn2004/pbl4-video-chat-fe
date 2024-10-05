import { Avatar, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../hooks/useSocket';
import { authSelector } from '../redux/features/auth/authSelections';

export const CallContext = createContext();

export const CallContextProvider = ({ children }) => {
    const { socket } = useSocket();
    const { user: currentUser } = useSelector(authSelector);
    const [isCalling, setIsCalling] = useState(false);
    const [chatRoomData, setChatRoomData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const cancelCall = useCallback(() => {
        socket?.emit('callee cancel call', { chatRoom: chatRoomData._id });
        setIsModalOpen(false);
    }, [socket, chatRoomData?._id]);

    useEffect(() => {
        socket?.on('new video call', ({ from, chatRoom }) => {
            if (isCalling) {
                socket?.emit("callee's calling someone", { calleData: currentUser, from });
                return;
            }
            setIsCalling(() => true);
            setChatRoomData(() => chatRoom);
            showModal();
        });
        return () => {
            socket?.off('new video call');
        };
    }, [socket, currentUser, isCalling]);

    const handleButtonStart = useCallback(async () => {
        const baseUrl = window.location.origin; // Get the base URL of your app
        const videoCallUrl = `${baseUrl}/video-call/${chatRoomData?._id}?type=answer`; // Concatenate the video call route
        window.open(videoCallUrl, '_blank'); // Open the video call page in a new tab
    }, [chatRoomData?._id]);

    return (
        <CallContext.Provider value={{ chatRoomData }}>
            <Modal title='Cuộc gọi đến' open={isModalOpen} footer={null} onCancel={cancelCall}>
                <Avatar src={chatRoomData?.chatRoomImage} />
                <h2>{`${chatRoomData?.name}  Đang gọi cho bạn`}</h2>
                <Button onClick={handleButtonStart}>bắt máy</Button>
                <Button onClick={cancelCall}>hủy bỏ</Button>
            </Modal>
            {children}
        </CallContext.Provider>
    );
};
CallContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
