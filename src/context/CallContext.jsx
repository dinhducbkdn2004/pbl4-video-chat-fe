import { Peer } from 'peerjs';
import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../hooks/useSocket';
import { authSelector } from '../redux/features/auth/authSelections';
import { Avatar, Button, Modal } from 'antd';

export const CallContext = createContext();

export const CallContextProvider = ({ children }) => {
    const { socket } = useSocket();
    const { user: currentUser } = useSelector(authSelector);
    const [isCalling, setIsCalling] = useState(false);

    const [myPeer, setMyPeer] = useState(null);

    const [calleePeers, setCalleePeers] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(true);

    const [chatRoomId, setChatRoomId] = useState(null);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const answerCall = useCallback(async (incomingCall, myStreamRef) => {
        try {
            // Lấy stream của người dùng (gồm cả video và audio)
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            myStreamRef.current.subObject = stream;
            // Trả lời cuộc gọi với stream của mình
            incomingCall.answer(stream);

            // Lắng nghe sự kiện 'stream' từ người gọi đến
            incomingCall.on('stream', (remoteStream) => {
                // Lưu lại stream của người gọi để hiển thị
                setCalleePeers((prevPeers) => [remoteStream, ...prevPeers]);
            });

            // Đánh dấu là đang trong cuộc gọi
            setIsCalling(true);
        } catch (error) {
            console.error('Error answering the call:', error);
        }
    }, []);

    useEffect(() => {
        (async () => {
            if (!currentUser) return;
            const peer = new Peer(currentUser._id);

            peer.on('open', () => {
                setMyPeer(peer);
            });
            peer.on('error', (err) => {
                console.error('Peer connection error:', err);
            });
        })();
    }, [currentUser]);

    useEffect(() => {
        socket?.on('new video call', ({ from, to, chatRoomId }) => {
            if (isCalling) {
                socket?.emit("callee's calling someone", { calleData: currentUser, from });
                return;
            }
            setChatRoomId(chatRoomId)
            myPeer?.on('call', async (incomingCall) => {
                await answerCall(incomingCall); // Gọi hàm trả lời cuộc gọi
            });
        });
        return () => {
            socket?.off('new video call');
        };
    }, [socket, currentUser, isCalling, myPeer, answerCall]);

    const startCall = useCallback(
        (userToCallSocketId, stream) => {
            const call = myPeer?.call(userToCallSocketId, stream);

            call.on('stream', (remoteStream) => {
                setCalleePeers((pre) => [remoteStream, ...pre]);
            });

            socket?.emit('start new call', { to: userToCallSocketId, from: currentUser?._id });
        },
        [currentUser, myPeer, socket]
    );

    const leaveCall = () => {
        setIsCalling(false);
    };

    const cancelCall = () => {};
    const handleButtonStart = useCallback(() => {
        const baseUrl = window.location.origin; // Get the base URL of your app
        const videoCallUrl = `${baseUrl}/video-call/${chatRoomId}?type=answer`; // Concatenate the video call route
        window.open(videoCallUrl, '_blank'); // Open the video call page in a new tab
    }, [chatRoomId]);

    return (
        <CallContext.Provider
            value={{
                answerCall,
                myPeer,
                leaveCall,
                calleePeers,
                startCall
            }}
        >
            <Modal title='Cuộc gọi đến' open={isModalOpen} footer={null}>
                <Avatar />
                <h2>Đang gọi cho bạn</h2>
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
