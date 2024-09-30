import { Button, message, Spin } from 'antd';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import RoomChatApi from '../apis/RoomChatApi';
import { CallContext } from '../context/CallContext';
import useFetch from '../hooks/useFetch';
import { authSelector } from '../redux/features/auth/authSelections';
import { useSocket } from '../hooks/useSocket';

const VideoCall = () => {
    const { chatRoomId } = useParams();
    const [searchParams] = useSearchParams();
    const typeCall = searchParams.get('type');
    const { socket } = useSocket();
    const { fetchData, isLoading } = useFetch({ showError: false, showSuccess: false });

    const currentStream = useRef(null);

    const { leaveCall, myPeer, startCall, calleePeers } = useContext(CallContext);

    const [particapants, setParticapants] = useState([]);
    const [myStream, setMyStream] = useState(null);
    const { user: currentUser } = useSelector(authSelector);

    useEffect(() => {
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                const { data, isOk } = await fetchData(() => RoomChatApi.getDetailChatRoom(chatRoomId));
                if (isOk) {
                    setMyStream(stream);
                    setParticapants(data.participants);
                }
            } catch (error) {
                console.log(error);
                message.error('Bạn phải cấp quyền video và audio để bắt đầu ');
            }
        })();
    }, [chatRoomId, fetchData]);

    useEffect(() => {
        if (particapants.length > 0 && myStream) {
            currentStream.current.srcObject = myStream;
        }
    }, [currentUser?._id, particapants, myStream]);

    useEffect(() => {
        if (typeCall === 'calling') {
            particapants
                .filter((participant) => participant._id !== currentUser._id)
                .forEach((participant) => {
                    console.log(participant);

                    startCall(participant._id, myStream);

                    socket?.emit('start new call', { to: participant, chatRoomId });
                });
        }
    }, [typeCall, particapants, currentUser?._id, startCall, socket, myStream, chatRoomId]);

    if (isLoading) return <Spin spinning={true} />;

    return (
        <div className='flex h-lvh flex-col justify-between overflow-auto bg-black-default px-10 pt-10'>
            <div className='flex flex-1 flex-wrap items-center justify-center gap-4'>
                <div className='h-auto w-1/3 overflow-hidden rounded-2xl'>
                    <video muted ref={currentStream} autoPlay playsInline />
                    {calleePeers.map((calleePeer, index) => (
                        <video key={index} muted ref={calleePeer} autoPlay playsInline />
                    ))}
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
