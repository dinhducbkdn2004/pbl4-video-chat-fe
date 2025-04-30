import { Button, message as MessageComponent, Tooltip, Avatar, Badge } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Peer } from 'peerjs';
import { useSocket } from '../hooks/useSocket';

import { useSelector } from 'react-redux';
import { authSelector } from '../redux/features/auth/authSelections';
import StreamsGrid from './VideoCall/StreamsGrid';

// Icons cho UI hiện đại
import {
    AudioMutedOutlined,
    AudioOutlined,
    VideoCameraOutlined,
    StopOutlined,
    DesktopOutlined,
    DisconnectOutlined,
    SettingOutlined,
    InfoCircleOutlined,
    SwapOutlined
} from '@ant-design/icons';

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
    const [callStatus, setCallStatus] = useState(() => 'calling');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showCallInfo, setShowCallInfo] = useState(false);
    const [layout, setLayout] = useState('grid'); // 'grid', 'spotlight', 'sidebar'
    const [callDuration, setCallDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);

    // Phát hiện màn hình di động
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Đếm thời gian cuộc gọi
    useEffect(() => {
        let interval;
        if (callStatus === 'connected') {
            interval = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callStatus]);

    // Auto-hide controls sau một khoảng thời gian không hoạt động
    useEffect(() => {
        let timer;
        const handleUserActivity = () => {
            setShowControls(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (callStatus === 'connected' && !showCallInfo) {
                    setShowControls(false);
                }
            }, 5000);
        };

        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('click', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
        };
    }, [callStatus, showCallInfo]);

    useEffect(() => {
        if (peerStreams.length == 1 && callStatus === 'connected') {
            setCallStatus('end-calling');
        }

        if (peerStreams.length >= 2) {
            setCallStatus('connected');
        }
    }, [callStatus, peerStreams.length]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const addVideoStream = useCallback(({ peerId, stream, user }) => {
        setPeerStreams((prevPeerStreams) => {
            if (prevPeerStreams.some((ps) => ps.user._id === user._id)) {
                return prevPeerStreams;
            }
            return [...prevPeerStreams, { peerId, stream, user }];
        });
    }, []);

    const updatePeerStreams = useCallback(() => {
        const connections = peerRef.current?.connections || {};
        const currentStream = myStreamRef.current;

        for (let peerId in connections) {
            connections[peerId].forEach((connection) => {
                const sender = connection.peerConnection.getSenders().find((s) => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(currentStream.getVideoTracks()[0]);
                }
            });
        }

        // Cập nhật lại danh sách `peerStreams` để đảm bảo UI đồng bộ
        setPeerStreams((prevPeerStreams) =>
            prevPeerStreams.map((peerStream) => ({
                ...peerStream,
                stream: peerStream.peerId === peerRef.current.id ? currentStream : peerStream.stream
            }))
        );
    }, []);

    const stopScreenShare = useCallback(async () => {
        try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            // Cập nhật stream local
            myStreamRef.current?.getTracks().forEach((track) => track.stop());
            myStreamRef.current = cameraStream;

            if (myVideoRef.current) {
                myVideoRef.current.srcObject = cameraStream;
                myVideoRef.current.play();
            }

            updatePeerStreams();
            setIsScreenSharing(false);
        } catch (err) {
            MessageComponent.error('Error switching back to camera:', err);
        }
    }, [updatePeerStreams]);

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

                // Cập nhật trạng thái
                myStreamRef.current?.getVideoTracks().forEach((track) => track.stop());
                myStreamRef.current = screenStream;

                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = screenStream;
                    myVideoRef.current.play();
                }
                updatePeerStreams();

                setIsScreenSharing(true);
            } catch (err) {
                MessageComponent.error('Error sharing screen:', err);
            }
        } else {
            stopScreenShare();
        }
    }, [isScreenSharing, stopScreenShare, updatePeerStreams]);

    const removePeer = useCallback((userId) => {
        setPeerStreams((prevPeerStreams) => prevPeerStreams.filter((ps) => ps.user._id !== userId)); // Remove peer by peerId
    }, []);

    const connectToNewUser = useCallback(
        (peerId, stream, user) => {
            if (!peerRef.current) return;
            console.log(`Connecting to ${user.name} (${peerId})`);

            const call = peerRef.current.call(peerId, stream, { metadata: { user: currentUser } });

            if (!call) return;

            call.on('stream', (remoteStream) => {
                console.log(`Received stream from ${user.name}`);
                addVideoStream({ peerId, stream: remoteStream, user });
            });

            call.on('close', () => {
                console.log(`Call with ${user.name} closed`);
                removePeer(user._id);
            });
        },
        [addVideoStream, currentUser, removePeer]
    );

    const leaveCall = useCallback(() => {
        myStreamRef.current?.getTracks().forEach((track) => track.stop());
        //socket.emit('user:leave_call', { roomId: currentChatRoomId });
        socket.disconnect();
        peerRef.current?.destroy();
        window.close();
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

    const joinRoom = useCallback(
        (peerId) => {
            console.log('Joining room');
            socket?.emit('user:join-room', { roomId: currentChatRoomId, peerId, user: currentUser });
        },
        [currentChatRoomId, currentUser, socket]
    );

    useEffect(() => {
        const handleUserConnected = ({ peerId, user }) => {
            console.log(`${user.name} connected with Peer ID: ${peerId}`);
            connectToNewUser(peerId, myStreamRef.current, user); // Gửi stream của bạn đến người mới
        };

        const handleUserDisconnected = ({ user }) => {
            console.log(`User ${user.name} disconnected`);
            MessageComponent.error(`User ${user.name} đã thoát`);
            removePeer(user._id); // Loại bỏ peer khi người dùng rời khỏi
        };

        socket?.on('user-connected', handleUserConnected);
        socket?.on('user:leave_call', handleUserDisconnected);

        return () => {
            socket?.off('user-connected', handleUserConnected);
            socket?.off('user:leave_call', handleUserDisconnected);
        };
    }, [connectToNewUser, removePeer, socket]);

    useEffect(() => {
        (async () => {
            try {
                if (!socket || !currentUser) return;
                const myStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (myStream.getAudioTracks().length === 0) {
                    console.error('No audio track found in stream.');
                    MessageComponent.error('Không có micro khả dụng. Vui lòng kiểm tra thiết bị.');
                }
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

                    if (typeCall === 'calling') {
                        console.log('calling');

                        socket.emit('caller:start_new_call', { chatRoomId: currentChatRoomId });
                        return;
                    }

                    if (typeCall === 'answer') {
                        console.log('answer');
                        socket.emit('callee:accept_call', {
                            chatRoomId: currentChatRoomId,
                            peerId: peerRef.current?.id
                        });
                        return;
                    }
                });

                // Handle incoming calls
                peerRef.current.on('call', (call) => {
                    console.log('Call received with metadata:', call.metadata);
                    const { user } = call.metadata;
                    call.answer(myStreamRef.current); // Answer the call with current user's stream
                    call.on('stream', (remoteStream) => {
                        addVideoStream({ peerId: call.peer, stream: remoteStream, user });
                    });
                });
            } catch (error) {
                console.error('Failed to access mic:', error);
                MessageComponent.error('Không thể truy cập micro. Vui lòng kiểm tra quyền hoặc kết nối thiết bị.');
            }
        })();

        // Cleanup on unmount
        return () => {
            peerRef.current?.destroy();
        };
    }, [addVideoStream, currentChatRoomId, currentUser, joinRoom, socket, typeCall]);

    useEffect(() => {
        if (!socket) return;

        const handleCalleeResponse = ({ result, message }) => {
            console.log({ result, message });
            switch (result) {
                case 'accept':
                    MessageComponent.success(message);
                    break;
                case 'decline':
                    MessageComponent.error(message);
                    break;
                default:
                    MessageComponent.error('Không biết');
            }
        };

        const handleCallError = ({ message }) => {
            MessageComponent.error(message);
            setCallStatus('end-calling');
        };

        // Đăng ký sự kiện
        socket.on('server:send_callee_response', handleCalleeResponse);
        socket.on('server:send_call_error', handleCallError);

        // Hủy đăng ký sự kiện khi socket thay đổi hoặc component bị unmount
        return () => {
            socket.off('server:send_callee_response', handleCalleeResponse);
            socket.off('server:send_call_error', handleCallError);
        };
    }, [socket]);

    useEffect(() => {
        // Lắng nghe sự kiện beforeunload
        window.addEventListener('beforeunload', leaveCall);

        // Cleanup listener khi component unmount
        return () => window.removeEventListener('beforeunload', leaveCall);
    }, [leaveCall]);

    const toggleLayout = useCallback(() => {
        setLayout((current) => {
            const layouts = ['grid', 'spotlight', 'sidebar'];
            const currentIndex = layouts.indexOf(current);
            const nextIndex = (currentIndex + 1) % layouts.length;
            return layouts[nextIndex];
        });
    }, []);

    return (
        <div
            className='from-gray-900 to-black dark:to-black relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-b dark:from-black-light md:h-screen'
            onMouseMove={() => setShowControls(true)}
        >
            {/* Autoplay audio elements */}
            {callStatus === 'calling' && <audio src='/sounds/calling-state.mp3' loop autoPlay />}
            {callStatus === 'end-calling' && <audio src='/sounds/end-calling-state.mp3' autoPlay />}

            {/* Header with call info - visible when controls are shown */}
            {showControls && callStatus !== 'end-calling' && (
                <div className='from-black/70 text-white absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b to-transparent p-4 transition-opacity duration-300'>
                    <div className='flex items-center gap-2'>
                        <Badge status={callStatus === 'connected' ? 'success' : 'processing'} />
                        <span
                            className={`font-medium ${callStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'}`}
                        >
                            {callStatus === 'connected' ? 'Connected' : 'Connecting...'}
                        </span>
                        {callStatus === 'connected' && (
                            <span className='text-gray-300 ml-2 text-sm'>{formatDuration(callDuration)}</span>
                        )}
                    </div>
                    <div className='flex gap-3'>
                        <Tooltip title='Call information'>
                            <Button
                                type='text'
                                shape='circle'
                                icon={<InfoCircleOutlined style={{ color: 'white' }} />}
                                onClick={() => setShowCallInfo(!showCallInfo)}
                                className={showCallInfo ? 'bg-blue-500/30' : ''}
                            />
                        </Tooltip>
                        <Tooltip title='Change layout'>
                            <Button
                                type='text'
                                shape='circle'
                                icon={<SwapOutlined style={{ color: 'white' }} />}
                                onClick={toggleLayout}
                            />
                        </Tooltip>
                    </div>
                </div>
            )}

            {/* Participants sidebar */}
            {showCallInfo && (
                <div className='bg-gray-800/80 text-white absolute bottom-16 right-0 top-16 z-10 w-72 overflow-auto rounded-l-lg p-4 shadow-lg backdrop-blur-md transition-all duration-300'>
                    <h3 className='border-gray-700 mb-4 border-b pb-2 text-lg font-semibold'>Call Participants</h3>
                    <div className='flex flex-col gap-3'>
                        {peerStreams.map((peer) => (
                            <div
                                key={peer.peerId}
                                className='hover:bg-gray-700/50 flex items-center gap-3 rounded-lg p-2'
                            >
                                <Avatar size='large' src={peer.user.avatar || null}>
                                    {!peer.user.avatar && peer.user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <div>
                                    <div className='font-medium'>{peer.user.name}</div>
                                    <div className='text-gray-400 text-xs'>
                                        {peer.user._id === currentUser?._id ? '(You)' : 'Participant'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Video grid */}
            <div className='relative flex-1 overflow-hidden'>
                {callStatus !== 'end-calling' ? (
                    <StreamsGrid
                        peerStreams={peerStreams}
                        currentUserId={currentUser?._id}
                        isMobile={isMobile}
                        layout={layout}
                    />
                ) : (
                    <div className='from-gray-900 to-black flex h-full w-full flex-col items-center justify-center bg-gradient-to-b'>
                        <div className='text-white mb-2 text-3xl font-light'>Cuộc gọi đã kết thúc</div>
                        <div className='text-gray-400 mb-8'>Thời lượng: {formatDuration(callDuration)}</div>
                        <div className='flex gap-4'>
                            <Button
                                type='primary'
                                size={isMobile ? 'middle' : 'large'}
                                onClick={leaveCall}
                                className='flex items-center gap-2 rounded-full bg-red-500 px-8 hover:bg-red-600'
                                icon={<DisconnectOutlined />}
                            >
                                Thoát
                            </Button>
                            <Button
                                type='primary'
                                size={isMobile ? 'middle' : 'large'}
                                className='bg-blue-500 hover:bg-blue-600 flex items-center gap-2 rounded-full px-8'
                                onClick={() => {
                                    const baseUrl = window.location.origin;
                                    const videoCallUrl = `${baseUrl}/video-call/${currentChatRoomId}?type=calling`;
                                    window.open(videoCallUrl);
                                }}
                                icon={<VideoCameraOutlined />}
                            >
                                Gọi lại
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Control panel */}
            {callStatus !== 'end-calling' && showControls && (
                <div className='from-black/70 absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center bg-gradient-to-t to-transparent p-6 transition-opacity duration-300'>
                    <div className='bg-gray-800/60 flex flex-wrap justify-center gap-3 rounded-full p-3 shadow-xl backdrop-blur-sm md:gap-5'>
                        <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                            <Button
                                type='primary'
                                size={isMobile ? 'middle' : 'large'}
                                shape='circle'
                                className={`${
                                    isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                                } flex items-center justify-center shadow-md transition-all`}
                                onClick={toggleMute}
                                icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                            />
                        </Tooltip>

                        <Tooltip title={isVideoStopped ? 'Turn camera on' : 'Turn camera off'}>
                            <Button
                                type='primary'
                                size={isMobile ? 'middle' : 'large'}
                                shape='circle'
                                className={`${
                                    isVideoStopped ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                                } flex items-center justify-center shadow-md transition-all`}
                                onClick={toggleVideo}
                                icon={isVideoStopped ? <StopOutlined /> : <VideoCameraOutlined />}
                            />
                        </Tooltip>

                        {!isMobile && (
                            <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
                                <Button
                                    type='primary'
                                    size='large'
                                    shape='circle'
                                    className={`${
                                        isScreenSharing
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                    } flex items-center justify-center shadow-md transition-all`}
                                    onClick={toggleScreenShare}
                                    icon={<DesktopOutlined />}
                                />
                            </Tooltip>
                        )}

                        <Tooltip title='End call'>
                            <Button
                                type='primary'
                                size={isMobile ? 'middle' : 'large'}
                                shape='circle'
                                className='flex items-center justify-center bg-red-500 shadow-md transition-all hover:scale-110 hover:bg-red-600'
                                onClick={leaveCall}
                                icon={<DisconnectOutlined />}
                            />
                        </Tooltip>
                    </div>
                </div>
            )}
        </div>
    );
};

VideoCall.propTypes = {};

export default VideoCall;
