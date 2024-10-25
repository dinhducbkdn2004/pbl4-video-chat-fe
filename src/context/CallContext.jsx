import { Avatar, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
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
    const audioRef = useRef(null);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const cancelCall = useCallback(() => {
        socket?.emit('callee cancel call', { chatRoom: chatRoomData?._id });
        audioRef.current && audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsModalOpen(false);
        setIsCalling(false)
    }, [socket, chatRoomData?._id]);

    useEffect(() => {
        socket?.on('new video call', ({ from, chatRoom }) => {
            if (isCalling) {
                socket?.emit("callee's calling someone", { calleData: currentUser, from });
                return;
            }

            setIsCalling(true);
            setChatRoomData(chatRoom);
            showModal();
            const playAudio = async () => {
                try {
                    await audioRef.current.play();
                } catch (error) {
                    console.log("Không thể phát âm thanh tự động, cần sự tương tác từ người dùng.");
                }
            };
            playAudio();
        });

        return () => {
            socket?.off('new video call');
        };
    }, [socket, currentUser, isCalling]);

    const handleButtonStart = useCallback(() => {
        const baseUrl = window.location.origin;
        const videoCallUrl = `${baseUrl}/video-call/${chatRoomData?._id}?type=answer`;
        audioRef.current && audioRef.current.pause();
        audioRef.current.currentTime = 0;
        window.open(videoCallUrl, '_blank');
    }, [chatRoomData?._id]);

    return (
        <CallContext.Provider value={{ chatRoomData }}>
            <audio src='/sounds/thongbao-cuocgoi.mp3' ref={audioRef} loop />
            <Modal title='Cuộc gọi đến' open={isModalOpen} footer={null} onCancel={cancelCall}>
                <Avatar src={chatRoomData?.chatRoomImage} />
                <h2>{`${chatRoomData?.name} Đang gọi cho bạn`}</h2>
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
