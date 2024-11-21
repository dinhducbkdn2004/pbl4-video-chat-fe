import React, { useState } from 'react';
import { Card, Avatar, Typography, Button, Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import RoomChatApi from '../../apis/RoomChatApi';
import useFetch from '../../hooks/useFetch';

const { Title, Text } = Typography;

const GroupCard = ({ data, isMember }) => {
    const navigate = useNavigate();
    const { fetchData } = useFetch({ showSuccess: true, showError: true });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');
    const [requestSent, setRequestSent] = useState(false);

    const handleButtonClick = () => {
        if (isMember) {
            navigate(`/message/${data._id}`);
        } else {
            setIsModalVisible(true);
        }
    };

    const handleOk = async () => {
        await fetchData(() => RoomChatApi.createRequest(data._id, requestMessage));
        setIsModalVisible(false);
        setRequestMessage('');
        setRequestSent(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setRequestMessage('');
    };

    return (
        <>
            <Card
                className='bg-white-default shadow-md'
                hoverable
                style={{
                    width: '90%',
                    padding: '10px',
                    height: '200px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundImage: `url(${data.chatRoomImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white'
                }}
            >
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px', borderRadius: '8px' }}>
                    <Title level={4} style={{ marginBottom: '0', color: 'white' }}>
                        {data.name}
                    </Title>
                    <Text type='secondary' style={{ color: 'white' }}>
                        Admin: {data.admins[0].name}
                    </Text>
                </div>
                <div style={{ marginTop: '20px', flexGrow: 1 }}>
                    <Text strong style={{ color: 'white' }}>Participants:</Text>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px'
                        }}
                    >
                        {data.participants.length > 0 ? (
                            <Avatar.Group maxCount={5} size="small" maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                {data.participants.map((participant) => (
                                    <Avatar key={participant._id} src={participant.avatar} />
                                ))}
                            </Avatar.Group>
                        ) : (
                            <Text type='secondary' style={{ color: 'white' }}>No participants available.</Text>
                        )}
                        <Button
                            type='primary'
                            style={{ marginLeft: '10px' }}
                            onClick={handleButtonClick}
                            disabled={requestSent}
                        >
                            {isMember ? 'Access Group' : requestSent ? 'Request Sent' : 'Request to Join'}
                        </Button>
                    </div>
                </div>
            </Card>

            <Modal title='Request to Join Group' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder='Enter your message'
                />
            </Modal>
        </>
    );
};

export default GroupCard;