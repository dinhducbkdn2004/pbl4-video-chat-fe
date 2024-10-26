import { Button, message as MessageComponent, Spin } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { Peer } from 'peerjs';
import { useSocket } from '../hooks/useSocket';
import { authSelector } from '../redux/features/auth/authSelections';
import useFetch from './../hooks/useFetch';
import VideoGrid from './VideoGrid';

const VideoCall = () => {
    const myStreamRef = useRef(null);
    const [myPeer, setMyPeer] = useState(null);
    const [calleePeers, setCalleePeers] = useState([]);
    const { chatRoomId: currentChatRoomId } = useParams();
    const [searchParams] = useSearchParams();
    const typeCall = searchParams.get('type');
    const { socket } = useSocket();
    const { user } = useSelector(authSelector);
    const { fetchData, isLoading } = useFetch({ showError: false, showSuccess: false });
    const { user: currentUser } = useSelector(authSelector);
    const [callStatus, setCallStatus] = useState(() => (typeCall === 'answer' ? 'accept' : 'calling'));

    const startCall = useCallback(
        async (calleePeerId) => {
            const call = myPeer?.call(calleePeerId, myStreamRef.current);
            call?.on('stream', (remoteStream) => {
                setCalleePeers((pre) => [remoteStream, ...pre]);
            });

            call?.on('error', (err) => {
                console.error('Call error:', err);
            });
        },
        [myPeer]
    );

    const answerCall = useCallback(async (incomingCall) => {
        try {
            // Trả lời cuộc gọi với stream của mình
            incomingCall.answer(myStreamRef.current);

            // Lắng nghe sự kiện 'stream' từ người gọi đến
            incomingCall.on('stream', (remoteStream) => {
                setCalleePeers((prevPeers) => [remoteStream, ...prevPeers]);
            });
        } catch (error) {
            console.error('Error answering the call:', error);
        }
    }, []);

    const leaveCall = useCallback(() => {
        myStreamRef.current?.getTracks().forEach((track) => track.stop());
        setCalleePeers([]);
        socket.emit('user:leave_call');
        window.close();
        // Destroy the peer connection
        myPeer?.destroy();
    }, [myPeer, socket]);

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
                console.log('Incoming call:', incomingCall);

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

    if (isLoading) return <Spin spinning={true} />;

    return (
        <>
            {callStatus === 'calling' && <audio src='/sounds/calling-state.mp3' loop autoPlay />}
            {callStatus === 'end-calling' && <audio src='/sounds/end-calling-state.mp3' autoPlay />}

            <div className='flex h-lvh flex-col justify-between overflow-auto bg-black-default px-10 pt-10'>
                <div className='flex flex-1 flex-wrap items-center justify-center gap-4'>
                    <div className='h-auto w-1/3 overflow-hidden rounded-2xl'>
                        <VideoGrid localStream={myStreamRef.current} calleePeers={calleePeers} />
                    </div>
                </div>
                {callStatus !== 'end-calling' && (
                    <div className='flex items-center justify-center gap-4 p-10'>
                        <Button>Mute</Button>
                        <Button>Stop Video</Button>
                        <Button>Share Screen</Button>
                        <Button onClick={leaveCall}>Leave Call</Button>
                    </div>
                )}

                {callStatus === 'end-calling' && (
                    <div className='flex items-center justify-center gap-4 p-10'>
                        <Button onClick={leaveCall}>Thoát</Button>
                        <Button onClick={() => window.location.reload()}>Gọi lại</Button>
                    </div>
                )}
            </div>
        </>
    );
};

VideoCall.propTypes = {};

export default VideoCall;
