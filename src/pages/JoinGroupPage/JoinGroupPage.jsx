import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomChatApi from '../../apis/RoomChatApi';
import useFetch from '../../hooks/useFetch';
import { notification, Button, Card, Skeleton, Avatar, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import moment from 'moment';

const { Meta } = Card;
const { Text } = Typography;

const JoinGroupPage = () => {
    const { user: currentUser } = useSelector(authSelector);
    const { chatRoomId } = useParams();
    const navigate = useNavigate();
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const [chatRoom, setChatRoom] = useState(null);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        const fetchChatRoomDetails = async () => {
            const { data, isOk } = await fetchData(() => RoomChatApi.getDetailChatRoom(chatRoomId));
            if (isOk) {
                setChatRoom(data);
                console.log('chat room details', data);
                if (currentUser) {
                    setIsMember(data.participants.some((member) => member._id === currentUser._id));
                }
            } else {
                notification.error({
                    message: 'Unable to fetch chat room details!',
                    showProgress: true,
                    pauseOnHover: true
                });
                navigate('/');
            }
        };

        fetchChatRoomDetails();
    }, [chatRoomId, fetchData, navigate, currentUser]);

    const handleSendRequest = async () => {
        if (!currentUser) return;
        const { isOk } = await fetchData(() => RoomChatApi.createRequest(chatRoomId, 'Request to join the group'));
        if (isOk) {
            notification.success({
                message: 'Success',
                description: 'Join request sent successfully!',
                showProgress: true,
                pauseOnHover: true
            });
            setTimeout(() => {
                window.close();
            }, 3000);
        } else {
            notification.error({
                message: 'Failed to send join request!',
                description: 'Your request waiting for approval or you are already a member of the group.',
                showProgress: true,
                pauseOnHover: true
            });
        }
    };

    return (
        <div className='flex h-screen items-center justify-center bg-white-dark p-4'>
            <Card
                style={{ width: 400, textAlign: 'center', borderRadius: '10px', overflow: 'hidden' }}
                cover={<img alt='avatar' src={chatRoom?.chatRoomImage} className='mx-auto h-40 w-40 rounded-full' />}
                actions={[
                    isMember ? (
                        <p key='member'>You are already a member of the group</p>
                    ) : chatRoom?.privacy === 'PUBLIC' ? (
                        <Button type='primary' onClick={handleSendRequest} key='join'>
                            Send Join Request
                        </Button>
                    ) : (
                        <Button type='primary' onClick={handleSendRequest} key='request'>
                            Send Join Request
                        </Button>
                    )
                ]}
            >
                <Skeleton loading={isLoading} avatar active>
                    <Meta title={chatRoom?.name} description={chatRoom?.description} />
                    <p>Privacy: {chatRoom?.privacy}</p>
                    <p>Created At: {moment(chatRoom?.createdAt).format('LLL')}</p>
                    <Text strong style={{ color: 'black' }}>
                        Participants:
                    </Text>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px'
                        }}
                    >
                        {chatRoom?.participants.length > 0 ? (
                            <Avatar.Group
                                maxCount={5}
                                size='small'
                                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                            >
                                {chatRoom.participants.map((participant) => (
                                    <Avatar key={participant._id} src={participant.avatar} />
                                ))}
                            </Avatar.Group>
                        ) : (
                            <Text type='secondary' style={{ color: 'gray' }}>
                                No participants available.
                            </Text>
                        )}
                    </div>
                </Skeleton>
            </Card>
        </div>
    );
};

export default JoinGroupPage;
