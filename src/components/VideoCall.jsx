import { Button, message as MessageComponent } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { Peer } from 'peerjs';
import { useSocket } from '../hooks/useSocket';
import VideoGrid from './VideoGrid';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/features/auth/authSelections';

const VideoCall = () => {
    const { chatRoomId: currentChatRoomId } = useParams();
    const [searchParams] = useSearchParams();
    const typeCall = searchParams.get('type');
    const { socket } = useSocket();
    const { user: currentUser } = useSelector(authSelector);

    const myStreamRef = useRef(null);
    const screenStreamRef = useRef(null);
    const currentPeer = useRef(null);

    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [myPeer, setMyPeer] = useState(null);
    const [calleePeers, setCalleePeers] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoStopped, setIsVideoStopped] = useState(false);
    const [callStatus, setCallStatus] = useState(() => (typeCall === 'answer' ? 'connected' : 'calling')); // calling, connected, end-calling

    const startCall = useCallback(
        async (calleePeerId) => {
            const call = myPeer?.call(calleePeerId, myStreamRef.current, {
                metadata: {
                    user: { name: currentUser.name, avatar: currentUser.avatar, id: currentUser._id }
                }
            });
            call?.on('stream', (remoteStream) => {
                setCalleePeers((prevPeers) => {
                    // Add stream with metadata
                    const newPeer = { stream: remoteStream, user: call.metadata.user };
                    return prevPeers.some((peer) => peer.stream.id === remoteStream.id)
                        ? prevPeers
                        : [newPeer, ...prevPeers];
                });
            });

            call?.on('error', (err) => {
                console.error('Call error:', err);
            });
            currentPeer.current = call;
        },
        [myPeer, currentUser?.name, currentUser?.avatar, currentUser?._id]
    );

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = screenStream;
                setIsScreenSharing(true);

                const videoTrack = screenStream.getVideoTracks()[0];
                const sender = myStreamRef.current.getVideoTracks()[0];
                sender.stop();
                myStreamRef.current.removeTrack(sender);
                myStreamRef.current.addTrack(videoTrack);
                currentPeer.current.peerConnection
                    .getSenders()
                    .find((s) => s.track.kind == videoTrack.kind)
                    .replaceTrack(videoTrack);
            } catch (error) {
                console.error('Error sharing screen:', error);
            }
        } else {
            // Stop screen sharing
            const videoTrack = myStreamRef.current.getVideoTracks()[0];
            const screenTrack = screenStreamRef.current.getVideoTracks()[0];
            screenTrack.stop();
            myStreamRef.current.removeTrack(screenTrack);
            myStreamRef.current.addTrack(videoTrack);
            currentPeer.current.peerConnection
                .getSenders()
                .find((s) => s.track.kind == videoTrack.kind)
                .replaceTrack(videoTrack);

            setIsScreenSharing(false);
        }
    };

    const answerCall = useCallback(
        async (incomingCall) => {
            try {
                
                incomingCall.answer(myStreamRef.current, {
                    metadata: {
                        user: {
                            name: currentUser.name,
                            avatar: currentUser.avatar,
                            id: currentUser._id
                        }
                    }
                });

                // Lắng nghe sự kiện 'stream' từ người gọi đến
                incomingCall.on('stream', (remoteStream) => {
                    setCalleePeers((prevPeers) => {
                        const newPeer = { stream: remoteStream, user: incomingCall.metadata.user };
                        return prevPeers.some((stream) => stream.id === remoteStream.id)
                            ? prevPeers
                            : [newPeer, ...prevPeers];
                    });
                });
            } catch (error) {
                console.error('Error answering the call:', error);
            }
        },
        [currentUser?._id, currentUser?.avatar, currentUser?.name]
    );

    const leaveCall = useCallback(() => {
        myStreamRef.current?.getTracks().forEach((track) => track.stop());
        socket.emit('user:leave_call');
        window.close();
        // Destroy the peer connection
        myPeer?.destroy();
    }, [myPeer, socket]);

    const toggleMute = useCallback(() => {
        const stream = myStreamRef.current;
        if (stream) {
            stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const toggleVideo = useCallback(() => {
        const stream = myStreamRef.current;
        if (stream) {
            stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
            setIsVideoStopped(!isVideoStopped);
        }
    }, [isVideoStopped]);

    useEffect(() => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            myStreamRef.current = stream;
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const peer = new Peer();

            peer.on('open', () => {
                setMyPeer(peer);
            });

            peer.on('call', async (incomingCall) => {
                await answerCall(incomingCall);
            });

            peer.on('error', (err) => {
                console.error('Peer connection error:', err);
            });

            return () => peer.destroy();
        })();
    }, [answerCall]);

    useEffect(() => {
        if (typeCall === 'calling') {
            socket?.emit('caller:start_new_call', { chatRoomId: currentChatRoomId });
            return;
        }
        if (typeCall === 'answer') {
            socket?.emit('callee:accept_call', { chatRoomId: currentChatRoomId, peerId: myPeer?._id });
            return;
        }
    }, [currentChatRoomId, myPeer?._id, socket, typeCall]);

    // Handle incoming calls
    useEffect(() => {
        socket?.on('server:send_callee_response', ({ result, from, chatRoomId, peerId, message }) => {
            console.log({ result, from, chatRoomId, peerId });
            if (result === 'accept' && chatRoomId === currentChatRoomId) {
                MessageComponent.success({
                    content: message
                });
                setCallStatus('connected');
                startCall(peerId);
            }
            if (result === 'decline' && chatRoomId === currentChatRoomId) {
                MessageComponent.error({
                    content: message
                });
                setCallStatus('end-calling');
            }
        });
        return () => socket?.off('server:send_callee_response');
    }, [socket, startCall, currentChatRoomId]);

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
        <>
            {callStatus === 'calling' && <audio src='/sounds/calling-state.mp3' loop autoPlay />}
            {callStatus === 'end-calling' && <audio src='/sounds/end-calling-state.mp3' autoPlay />}

            <div className='flex h-lvh flex-col justify-between overflow-auto bg-black-default px-10 pt-10'>
                <VideoGrid localStream={myStreamRef.current} calleePeers={calleePeers} />

                {callStatus !== 'end-calling' && (
                    <div className='flex items-center justify-center gap-4 p-10'>
                        <Button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</Button>
                        <Button onClick={toggleVideo}>{isVideoStopped ? 'Start Video' : 'Stop Video'}</Button>
                        <Button onClick={toggleScreenShare}>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</Button>
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
    );
};

VideoCall.propTypes = {};

export default VideoCall;
