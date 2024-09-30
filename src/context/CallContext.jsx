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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [chatRoomData, setChatRoomData] = useState(null);
    const myStreamRef = useRef(null);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const cancelCall = () => {
        setIsModalOpen(false);
    };
    const answerCall = useCallback(async (incomingCall) => {
        try {
            // Lấy stream của người dùng (gồm cả video và audio)
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            myStreamRef.current = stream;
            if (!incomingCall) {
                console.error('Incoming call object is null');
                return;
            }
            console.log(incomingCall);

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

            peer.on('call', async (incomingCall) => {
                if (!incomingCall) {
                    console.error('No incoming call received');
                    return;
                }
                console.log('Incoming call:', incomingCall);

                if (!isCalling) {
                    showModal();
                    await answerCall(incomingCall);
                }
            });

            peer.on('error', (err) => {
                console.error('Peer connection error:', err);
            });

            return () => peer.destroy();
        })();
    }, [currentUser, answerCall, isCalling]);

    useEffect(() => {
        socket?.on('new video call', ({ from, chatRoom }) => {
            if (isCalling) {
                socket?.emit("callee's calling someone", { calleData: currentUser, from });
                return;
            }

            setChatRoomData(() => chatRoom);
            setIsModalOpen(() => true);
        });
        return () => {
            socket?.off('new video call');
        };
    }, [socket, currentUser, isCalling]);

    const startCall = useCallback(
        (userToCallSocketId, stream) => {
            const call = myPeer?.call(userToCallSocketId, stream);

            call?.on('stream', (remoteStream) => {
                setCalleePeers((pre) => [remoteStream, ...pre]);
            });

            call?.on('error', (err) => {
                console.error('Call error:', err);
            });
        },
        [myPeer]
    );

    const leaveCall = () => {
        setIsCalling(false);

        // Clean up streams
        myStreamRef.current?.getTracks().forEach((track) => track.stop());
        setCalleePeers([]);

        // Destroy the peer connection
        myPeer?.destroy();
    };

    const handleButtonStart = useCallback(async () => {
        const baseUrl = window.location.origin; // Get the base URL of your app
        const videoCallUrl = `${baseUrl}/video-call/${chatRoomData?._id}?type=answer`; // Concatenate the video call route
        window.open(videoCallUrl, '_blank'); // Open the video call page in a new tab
    }, [chatRoomData?._id]);

    return (
        <CallContext.Provider
            value={{
                answerCall,
                myPeer,
                leaveCall,
                calleePeers,
                startCall,
                myStreamRef
            }}
        >
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
