import { Button, Spin } from 'antd';
import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { CallContext } from '../context/CallContext';

import { authSelector } from '../redux/features/auth/authSelections';
import { useSocket } from '../hooks/useSocket';
import VideoGrid from './VideoGrid';
import { Peer } from 'peerjs';
import useFetch from './../hooks/useFetch';
import RoomChatApi from './../apis/RoomChatApi';

const VideoCall = () => {
    const myStreamRef = useRef(null);
    const [myPeer, setMyPeer] = useState(null);
    const [calleePeers, setCalleePeers] = useState([]);
    const { chatRoomId } = useParams();
    const [searchParams] = useSearchParams();
    const typeCall = searchParams.get('type');
    const { socket } = useSocket();

    const { fetchData, isLoading } = useFetch({ showError: false, showSuccess: false });
    const { user: currentUser } = useSelector(authSelector);

    const startCall = useCallback(
        async (calleePeerId) => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            myStreamRef.current = stream;
            const call = myPeer?.call(calleePeerId, stream);

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
        } catch (error) {
            console.error('Error answering the call:', error);
        }
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
    }, [currentUser, answerCall]);
    useEffect(() => {
        (async () => {
            const { data, isOk } = await fetchData(() => RoomChatApi.getDetailChatRoom(chatRoomId));
            if (isOk) {
                if (typeCall === 'calling') {
                    data.participants
                        .filter((participant) => participant._id !== currentUser?._id)
                        .forEach((participant) => {
                            socket?.emit('start new call', { to: participant, chatRoomId });
                        });
                }
                if (typeCall === 'answer') {
                    socket?.emit('answer a call', { to: data, peerId: myPeer?._id });
                }
            }
        })();
    }, [chatRoomId, currentUser?._id, fetchData, myPeer?._id, socket, startCall, typeCall]);
    useEffect(() => {
        socket?.on('callee accept call', ({ peerId }) => {
            console.log(peerId);

            startCall(peerId);
        });
        return () => socket?.off('callee accept call');
    }, [socket, startCall]);

    const leaveCall = () => {
        // Clean up streams
        myStreamRef.current?.getTracks().forEach((track) => track.stop());
        setCalleePeers([]);

        // Destroy the peer connection
        myPeer?.destroy();
    };
    if (isLoading) return <Spin spinning={true} />;

    return (
        <div className='flex h-lvh flex-col justify-between overflow-auto bg-black-default px-10 pt-10'>
            <div className='flex flex-1 flex-wrap items-center justify-center gap-4'>
                <div className='h-auto w-1/3 overflow-hidden rounded-2xl'>
                    <VideoGrid localStream={myStreamRef.current} calleePeers={calleePeers} />
                </div>
            </div>
            <div className='flex items-center justify-center gap-4 p-10'>
                <Button>Mute</Button>
                <Button>Stop Video</Button>
                <Button>Share Screen</Button>
                <Button onClick={leaveCall}>Leave Call</Button>
            </div>
        </div>
    );
};

VideoCall.propTypes = {};

export default VideoCall;
