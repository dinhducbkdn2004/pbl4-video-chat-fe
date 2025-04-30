import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Button, Modal, Input, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import RoomChatApi from '../../apis/RoomChatApi';
import useFetch from '../../hooks/useFetch';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import { TeamOutlined, UserAddOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GroupCard = ({ data, isMember }) => {
    const navigate = useNavigate();
    const { fetchData } = useFetch({ showSuccess: false, showError: false });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { user: currentUser } = useSelector(authSelector);
    const [requestMessage, setRequestMessage] = useState(
        `Xin chào mình là ${currentUser.name}, mình biết nhóm qua Connectica. Duyệt mình với nhé!`
    );
    const [requestSent, setRequestSent] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [screenSize, setScreenSize] = useState('md');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);

            if (width < 576) {
                setScreenSize('xs');
            } else if (width < 768) {
                setScreenSize('sm');
            } else if (width < 992) {
                setScreenSize('md');
            } else if (width < 1200) {
                setScreenSize('lg');
            } else {
                setScreenSize('xl');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleButtonClick = () => {
        if (isMember) {
            navigate(`/message/${data._id}`);
        } else {
            setIsModalVisible(true);
        }
    };

    const handleOk = async () => {
        try {
            await fetchData(() => RoomChatApi.createRequest(data._id, requestMessage));
            notification.success({
                message: 'Request Sent',
                description: 'Your request to join the group has been sent successfully.'
            });
            setIsModalVisible(false);
            setRequestSent(true);
        } catch (error) {
            notification.error({
                message: 'Request Failed',
                description: 'There was an error sending your request. Please try again.'
            });
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Get card height based on screen size
    const getCardHeight = () => {
        if (screenSize === 'xs') return '170px';
        if (screenSize === 'sm') return '200px';
        return '220px';
    };

    return (
        <>
            <Card
                className='rounded-lg shadow-sm transition-all duration-300 hover:shadow-md'
                hoverable={true}
                style={{
                    width: '100%',
                    height: getCardHeight(),
                    position: 'relative',
                    overflow: 'hidden'
                }}
                bodyStyle={{ padding: 0 }}
            >
                {/* Background Image with Overlay */}
                <div
                    style={{
                        backgroundImage: `url(${data.chatRoomImage || 'https://source.unsplash.com/random/?group'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0
                    }}
                >
                    <div
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }}
                    />
                </div>

                {/* Content */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        padding: isMobile ? '12px' : '20px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                >
                    {/* Group Header */}
                    <div>
                        <Title
                            level={isMobile ? 5 : 4}
                            style={{
                                marginBottom: '4px',
                                color: 'white',
                                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                fontSize: isMobile ? '16px' : '20px',
                                lineHeight: isMobile ? '1.2' : '1.4',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {data.name}
                        </Title>
                        <Text
                            style={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: isMobile ? '11px' : '14px',
                                display: 'block',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            Admin: {data.admins[0].name}
                        </Text>
                    </div>

                    {/* Group Details */}
                    <div>
                        <div className='mb-2 flex items-center'>
                            <TeamOutlined
                                style={{ color: 'white', marginRight: '8px', fontSize: isMobile ? '12px' : '14px' }}
                            />
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: 500,
                                    fontSize: isMobile ? '11px' : '14px'
                                }}
                            >
                                {data.participants.length} Participants
                            </Text>
                        </div>

                        <div className='flex items-center justify-between'>
                            <Avatar.Group
                                maxCount={isMobile ? 3 : 5}
                                size={isMobile ? 'small' : 'default'}
                                maxStyle={{
                                    color: '#f56a00',
                                    backgroundColor: '#fde3cf',
                                    border: '1px solid white',
                                    fontSize: isMobile ? '10px' : '12px'
                                }}
                                style={{ marginRight: isMobile ? '4px' : '8px' }}
                            >
                                {data.participants.map((participant) => (
                                    <Avatar
                                        key={participant._id}
                                        src={participant.avatar}
                                        style={{
                                            border: '1px solid white',
                                            width: isMobile ? '24px' : '32px',
                                            height: isMobile ? '24px' : '32px'
                                        }}
                                    />
                                ))}
                            </Avatar.Group>

                            <Button
                                type={isMember ? 'primary' : 'default'}
                                style={{
                                    background: isMember ? undefined : 'rgba(255,255,255,0.9)',
                                    borderColor: isMember ? undefined : 'rgba(255,255,255,0.9)',
                                    padding: isMobile ? '0 8px' : undefined,
                                    height: isMobile ? '28px' : undefined,
                                    fontSize: isMobile ? '12px' : '14px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: isMobile ? '90px' : '120px'
                                }}
                                icon={
                                    isMember ? null : (
                                        <UserAddOutlined style={{ fontSize: isMobile ? '12px' : '14px' }} />
                                    )
                                }
                                onClick={handleButtonClick}
                                disabled={requestSent}
                                size={isMobile ? 'small' : 'middle'}
                                className='transition-all duration-200'
                            >
                                {isMember ? 'Access Group' : requestSent ? 'Request Sent' : 'Join Group'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Modal
                title='Request to Join Group'
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
                        Send a request to join <strong>{data.name}</strong> group
                    </p>
                    <Input.TextArea
                        style={{
                            height: isMobile ? '80px' : '100px',
                            width: '100%',
                            backgroundColor: 'transparent',
                            color: 'inherit'
                        }}
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder='Enter a message for your group join request'
                        maxLength={150}
                        showCount
                        className='dark:border-gray dark:bg-black-light dark:text-white-default'
                    />
                </div>
            </Modal>
        </>
    );
};

export default GroupCard;
