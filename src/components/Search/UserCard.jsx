import { Avatar, Button, Card, Modal, Input, Badge, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import RoomChatApi from '../../apis/RoomChatApi';
import userApi from '../../apis/userApi';
import useFetch from '../../hooks/useFetch';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import './UserCard.css';

const UserCard = ({ data }) => {
    const { name, avatar } = data;
    const { fetchData } = useFetch({ showError: false, showSuccess: false });
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [friendStatus, setFriendStatus] = useState(data.isFriend);
    const [sentRequestStatus, setSentRequestStatus] = useState(data.isSentRequest);
    const { user: currentUser } = useSelector(authSelector);
    const [friendMessage, setFriendMessage] = useState(
        `Xin chào mình là ${currentUser?.name}, mình biết bạn qua Connectica. Kết bạn nhé!`
    );
    const [isMobile, setIsMobile] = useState(false);

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

    const handleUserClick = () => {
        navigate(`/user/${data._id}`);
    };

    const handleFriendButtonClick = () => {
        if (friendStatus) {
            handleUnfriend();
        } else if (sentRequestStatus) {
            return;
        } else {
            setIsModalVisible(true);
        }
    };

    const handleUnfriend = async () => {
        try {
            const result = await fetchData(() => userApi.unfriend(data._id));
            if (result.isOk) {
                setFriendStatus(false);
                notification.success({
                    message: 'Unfriended',
                    description: `You are no longer friends with ${data.name}`
                });
            }
        } catch (error) {
            console.error('Error unfriending user:', error);
        }
    };

    const handleOk = async () => {
        try {
            await fetchData(() => RoomChatApi.createRequest(data._id, friendMessage, 'OneToOne'));
            setSentRequestStatus(true);
            notification.success({
                message: 'Request Sent',
                description: 'Your friend request has been sent successfully.'
            });
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleMessageButtonClick = async () => {
        try {
            const { isOk, data: room } = await fetchData(() => RoomChatApi.createPrivateRoom(data._id));
            if (isOk) {
                navigate(`/message/${room._id}`);
            }
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    const getFriendButtonText = () => {
        if (friendStatus) return 'Unfriend';
        if (sentRequestStatus) return 'Request Sent';
        return 'Add Friend';
    };

    return (
        <>
            <Card
                className='user-card flex flex-col rounded-lg shadow-sm transition-all duration-300 hover:shadow-md dark:bg-black-light dark:text-white-default'
                hoverable={true}
                bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
            >
                <div className='flex items-center gap-2 md:gap-3'>
                    <div className='relative'>
                        <Badge
                            dot={true}
                            color={friendStatus ? '#52c41a' : sentRequestStatus ? '#faad14' : '#B6B6B6'}
                            offset={[-4, 36]}
                        >
                            <Avatar
                                src={data.avatar}
                                size={isMobile ? 42 : 50}
                                className='border-gray-100 dark:border-gray-700 border-2'
                                onClick={handleUserClick}
                                style={{ cursor: 'pointer' }}
                            />
                        </Badge>
                    </div>

                    <div className='min-w-0 flex-1'>
                        <div className='flex flex-col md:flex-row md:items-center md:gap-2'>
                            <h1
                                className='text-black truncate text-base font-medium dark:text-white-default md:text-lg'
                                onClick={handleUserClick}
                                style={{ cursor: 'pointer' }}
                            >
                                {data.name}
                            </h1>
                            <div className='text-gray-400 hidden md:block'>•</div>
                        </div>
                        <p className='text-gray-400 dark:text-gray-300 mt-0 truncate text-xs md:text-sm'>
                            @{data.email?.split('@')[0] || 'user'}
                        </p>
                    </div>
                </div>

                <div className='mt-2 flex items-center justify-end gap-2 md:mt-3 md:gap-3'>
                    {friendStatus && (
                        <Button
                            type='primary'
                            onClick={handleMessageButtonClick}
                            className='rounded-md'
                            size={isMobile ? 'small' : 'middle'}
                            style={{
                                height: isMobile ? '28px' : '32px',
                                fontSize: isMobile ? '12px' : '14px',
                                padding: isMobile ? '0 10px' : undefined
                            }}
                        >
                            Message
                        </Button>
                    )}
                    <Button
                        type={friendStatus ? 'default' : sentRequestStatus ? 'dashed' : 'primary'}
                        onClick={handleFriendButtonClick}
                        disabled={sentRequestStatus}
                        className='rounded-md'
                        size={isMobile ? 'small' : 'middle'}
                        style={{
                            height: isMobile ? '28px' : '32px',
                            fontSize: isMobile ? '12px' : '14px',
                            padding: isMobile ? '0 10px' : undefined
                        }}
                    >
                        {getFriendButtonText()}
                    </Button>
                </div>
            </Card>

            <Modal
                title='Send Friend Request'
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText='Send Request'
                cancelText='Cancel'
                width={isMobile ? '95%' : 520}
                bodyStyle={{ padding: isMobile ? '12px' : '24px' }}
                centered
            >
                <div className='dark:bg-black-light dark:text-white-default'>
                    <p className='mb-3 text-sm md:text-base'>
                        Send a friend request to <strong>{data.name}</strong>
                    </p>
                    <Input.TextArea
                        value={friendMessage}
                        onChange={(e) => setFriendMessage(e.target.value)}
                        placeholder='Enter a message for your friend request'
                        maxLength={150}
                        showCount
                        style={{
                            height: isMobile ? '80px' : '100px',
                            backgroundColor: 'transparent',
                            color: 'inherit'
                        }}
                        className='dark:border-gray dark:bg-black-light dark:text-white-default'
                    />
                </div>
            </Modal>
        </>
    );
};

UserCard.propTypes = {
    data: PropTypes.object.isRequired
};

export default UserCard;
