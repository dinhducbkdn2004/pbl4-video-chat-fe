import { Button, message as MessageComponent } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Peer } from 'peerjs';
import { useSocket } from '../hooks/useSocket';

import { useSelector } from 'react-redux';
import { authSelector } from '../redux/features/auth/authSelections';
import StreamsGrid from './VideoCall/StreamsGrid';

const VideoCall = () => {
    const { chatRoomId: currentChatRoomId } = useParams();
    const [searchParams] = useSearchParams();
    const typeCall = searchParams.get('type');

    const myVideoRef = useRef(null);

    const myStreamRef = useRef(null);
    const { socket } = useSocket();
    const peerRef = useRef(null);
    const { user: currentUser } = useSelector(authSelector);

    const [isMuted, setIsMuted] = useState(false);
    const [peerStreams, setPeerStreams] = useState([]);
    const [isVideoStopped, setIsVideoStopped] = useState(false);
    const [callStatus, setCallStatus] = useState(() => (typeCall === 'answer' ? 'connected' : 'calling')); // calling, connected, end-calling
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    useEffect(() => {
        if (peerStreams.length > 0) {
            setCallStatus('connected');
        }
    }, [peerStreams]);

    console.log(peerStreams);

    const addVideoStream = useCallback(({ peerId, stream, user }) => {
        setPeerStreams((prevPeerStreams) => {
            // Check if the peerId already exists in the current state
            if (prevPeerStreams.some((ps) => ps.peerId === peerId)) {
                return prevPeerStreams; // Return the current state if the peerId exists
            }

            // Add the new peerId and stream to the array
            return [...prevPeerStreams, { peerId, stream, user }];
        });
    }, []);

    const stopScreenShare = useCallback(async () => {
        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            // Trở lại camera ban đầu

            const videoTrack = cameraStream.getVideoTracks()[0];

            // Gửi stream camera đến các peer
            const sender = peerRef.current?.connections;
            for (let peerId in sender) {
                sender[peerId].forEach((connection) => {
                    connection.peerConnection
                        .getSenders()
                        .find((s) => s.track.kind === 'video')
                        ?.replaceTrack(videoTrack);
                });
            }

            // Cập nhật stream local
            myStreamRef.current?.getTracks().forEach((track) => track.stop());
            myStreamRef.current = cameraStream;
            setIsScreenSharing(false);
        } catch (err) {
            console.error('Error switching back to camera:', err);
        }
    }, []);

    const toggleScreenShare = useCallback(async () => {
        if (!isScreenSharing) {
            try {
                // Bắt đầu chia sẻ màn hình
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

                // Gắn màn hình vào video local
                const videoTrack = screenStream.getVideoTracks()[0];
                videoTrack.onended = () => {
                    // Khi dừng chia sẻ màn hình, trở về camera
                    stopScreenShare();
                };

                // Gửi stream chia sẻ màn hình đến các peer
                const sender = peerRef.current?.connections;
                for (let peerId in sender) {
                    sender[peerId].forEach((connection) => {
                        connection.peerConnection
                            .getSenders()
                            .find((s) => s.track.kind === 'video')
                            ?.replaceTrack(videoTrack);
                    });
                }

                // Cập nhật trạng thái
                myStreamRef.current?.getVideoTracks().forEach((track) => track.stop());
                myStreamRef.current = screenStream;
                setIsScreenSharing(true);
            } catch (err) {
                console.error('Error sharing screen:', err);
            }
        } else {
            stopScreenShare();
        }
    }, [isScreenSharing, stopScreenShare]);

    const connectToNewUser = useCallback(
        (peerId, stream, user) => {
            if (!peerRef.current) return;
            console.log('Connecting to new user');
            const call = peerRef.current.call(peerId, stream);
            if (!call) return;

            call.on('stream', (remoteStream) => {
                addVideoStream({ peerId, remoteStream, user });
            });
        },
        [addVideoStream]
    );

    const leaveCall = useCallback(() => {
        myStreamRef.current?.getTracks().forEach((track) => track.stop());
        socket.emit('user:leave_call');
        window.close();
        // Destroy the peer connection
        peerRef.current?.destroy();
    }, [socket]);

    const toggleVideo = useCallback(() => {
        const videoTrack = myStreamRef.current?.getVideoTracks()?.[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoStopped(!videoTrack.enabled);
        }
    }, []);

    const toggleMute = useCallback(() => {
        const audioTrack = myStreamRef.current?.getAudioTracks()?.[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    }, []);

    const removePeer = useCallback((peerId) => {
        setPeerStreams((prevPeerStreams) => prevPeerStreams.filter((ps) => ps.peerId !== peerId)); // Remove peer by peerId
    }, []);

    const joinRoom = useCallback(
        (peerId) => {
            console.log('Joining room');
            socket?.emit('user:join-room', { roomId: currentChatRoomId, peerId, user: currentUser });
        },
        [currentChatRoomId, currentUser, socket]
    );

    useEffect(() => {
        const handleUserConnected = ({ peerId, user }) => {
            console.log(user);
            connectToNewUser(peerId, myStreamRef.current, user);
        };
        const handleUserDisconnected = ({ peerId }) => removePeer(peerId);

        socket?.on('user-connected', handleUserConnected);
        socket?.on('user-disconnected', handleUserDisconnected);

        return () => {
            socket?.off('user-connected');
            socket?.off('user-disconnected');
        };
    }, [connectToNewUser, currentChatRoomId, currentUser?._id, removePeer, socket]);

    useEffect(() => {
        if (!socket) return;
        if (typeCall === 'calling') {
            console.log('calling');
            console.log(socket);
            socket.emit('caller:start_new_call', { chatRoomId: currentChatRoomId });
            return;
        }

        if (typeCall === 'answer') {
            console.log('answer');
            socket.emit('callee:accept_call', { chatRoomId: currentChatRoomId, peerId: peerRef.current?.id });
            return;
        }
    }, [currentChatRoomId, socket, typeCall]);

    useEffect(() => {
        (async () => {
            if (!socket || !currentUser) return;
            const myStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            myStreamRef.current = myStream;

            if (myVideoRef.current) {
                myVideoRef.current.srcObject = myStream;
                myVideoRef.current.play();
            }

            // Initialize PeerJS
            peerRef.current = new Peer();

            // When PeerJS connection is opened
            peerRef.current.on('open', (peerId) => {
                console.log('My Peer ID:', peerId);
                joinRoom(peerId);
                addVideoStream({ peerId, stream: myStream, user: currentUser });
            });

            // Handle incoming calls
            peerRef.current.on('call', (call) => {
                call.answer(myStream); // Answer the call with current user's stream
                call.on('stream', (remoteStream) => {
                    addVideoStream({ peerId: call.peer, stream: remoteStream, user: currentUser });
                });
            });
        })();

        // Cleanup on unmount
        return () => {
            peerRef.current?.destroy();
        };
    }, [addVideoStream, currentUser, joinRoom, socket]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            leaveCall();
            // Ngăn trình duyệt đóng tab ngay lập tức
            event.preventDefault();
            event.returnValue = ''; // Cách làm cũ để hiển thị thông báo rời trang
        };

        // Lắng nghe sự kiện beforeunload
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup listener khi component unmount
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [leaveCall]);

    return (
        <div>
            <>
                {callStatus === 'calling' && <audio src='/sounds/calling-state.mp3' loop autoPlay />}
                {callStatus === 'end-calling' && <audio src='/sounds/end-calling-state.mp3' autoPlay />}

                <div className='flex h-lvh flex-col justify-between overflow-auto bg-black-default px-10 pt-10'>
                    <StreamsGrid peerStreams={peerStreams} />
                    {callStatus !== 'end-calling' && (
                        <div className='flex items-center justify-center gap-4 p-10'>
                            <Button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</Button>
                            <Button onClick={toggleVideo}>{isVideoStopped ? 'Start Video' : 'Stop Video'}</Button>
                            <Button onClick={toggleScreenShare}>
                                {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                            </Button>
                            <Button onClick={leaveCall}>Leave Call</Button>
                        </div>
                    )}

                    {callStatus === 'end-calling' && (
                        <>
                            <div>Đã kết thúc cuộc gọi</div>
                            <div className='flex items-center justify-center gap-4 p-10'>
                                <Button onClick={leaveCall}>Thoát</Button>
                                <Button onClick={() => window.location.reload()}>Gọi lại</Button>
                            </div>
                        </>
                    )}
                </div>
            </>
        </div>
    );
};

VideoCall.propTypes = {};

export default VideoCall;
