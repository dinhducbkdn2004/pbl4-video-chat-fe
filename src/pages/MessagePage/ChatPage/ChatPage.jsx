import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Popover, Input, Button, Modal, Avatar, Tooltip } from 'antd';
import {
    VideoCameraOutlined,
    PhoneOutlined,
    InfoCircleOutlined,
    SmileOutlined,
    PaperClipOutlined,
    SendOutlined
} from '@ant-design/icons';

import assets from '../../../assets/index';
import { useSocket } from '../../../hooks/useSocket';
import RoomChatApi from '../../../apis/RoomChatApi';
import useFetch from '../../../hooks/useFetch';
import './ChatPage.css';

const ChatPage = () => {
    const { chatId } = useParams();
    const location = useLocation();
    const roomName = location.state?.roomName || 'Default Room Name';
    const members = location.state?.members || [];
    const { socket } = useSocket();
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: false, showError: false });
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatRoomDetails, setChatRoomDetails] = useState(null);
    const [isVideoCallModalVisible, setIsVideoCallModalVisible] = useState(false);
    const [isVoiceCallModalVisible, setIsVoiceCallModalVisible] = useState(false);

    useEffect(() => {
        const fetchChatRoomDetails = async () => {
            if (!chatId) {
                console.error('Chat ID is undefined or null:', chatId);
                return;
            }
            try {
                const data = await fetchData(() => RoomChatApi.getChatRoomById(chatId));
                if (data.isOk) {
                    setChatRoomDetails(data);
                    setMessages(data.data.messages || []);
                    console.log('Chat Room Details:', data.data);
                }
            } catch (error) {
                console.log('Fetch Chat Room Details Error:', error);
            }
        };

        fetchChatRoomDetails();
    }, [chatId]);

    useEffect(() => {
        socket?.on('server-send-message', (incomingMessage) => {
            console.log(incomingMessage);

            setMessages((prevMessages) => [...prevMessages, incomingMessage]);
        });

        return () => {
            socket?.off('server-send-message');
        };
    }, [socket]);

    const handleSendMessage = () => {
        if (!message) return;
        socket?.emit('client-send-message', message, chatId);
        setMessage('');
    };

    const showVideoCallModal = () => {
        setIsVideoCallModalVisible(true);
    };

    const handleVideoCallOk = () => {
        setIsVideoCallModalVisible(false);
    };

    const handleVideoCallCancel = () => {
        setIsVideoCallModalVisible(false);
    };

    const showVoiceCallModal = () => {
        setIsVoiceCallModalVisible(true);
    };

    const handleVoiceCallOk = () => {
        setIsVoiceCallModalVisible(false);
    };

    const handleVoiceCallCancel = () => {
        setIsVoiceCallModalVisible(false);
    };

    return (
        <div className='flex h-screen flex-col'>
            <div className='flex h-[73px] items-center justify-between border-b border-[#e0e0e0] bg-white-default p-4'>
                <div className='flex items-center'>
                    <img src={assets.user} alt='User avatar' className='mr-2 h-12 w-12 rounded-full object-cover' />
                    <div>
                        <h4 className='m-0 text-base font-semibold'>{roomName}</h4>
                        <p className='text-gray-600 m-0 text-sm'>Last Seen at 07:15PM</p>
                    </div>
                </div>
                <div className='flex items-center'>
                    <Avatar.Group
                        className='m-3'
                        size='medium'
                        max={{ count: 2, style: { color: '#f56a00', backgroundColor: '#fde3cf' } }}
                    >
                        {members?.map((member, index) => (
                            <Tooltip key={index} title={member.name}>
                                <Avatar>{member.name.charAt(0)}</Avatar>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                    <ul className='m-0 flex list-none p-0'>
                        <li className='mr-5'>
                            <Popover content='Video Call' overlayStyle={{ borderRadius: '8px' }}>
                                <Button
                                    icon={<VideoCameraOutlined />}
                                    className='rounded-full p-3'
                                    onClick={showVideoCallModal}
                                />
                            </Popover>
                        </li>
                        <li className='mr-5'>
                            <Popover content='Voice Call' overlayStyle={{ borderRadius: '8px' }}>
                                <Button
                                    icon={<PhoneOutlined />}
                                    className='rounded-full p-3'
                                    onClick={showVoiceCallModal}
                                />
                            </Popover>
                        </li>
                        <li className='mr-5'>
                            <Popover content='Contact Info' overlayStyle={{ borderRadius: '8px' }}>
                                <Button icon={<InfoCircleOutlined />} className='rounded-full p-3' />
                            </Popover>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='bg-white custom-scroll flex-1 overflow-y-auto p-5'>
                {messages?.map((msg, index) => (
                    <div key={index} className={`mb-4 ${msg.sender.name === 'You' ? 'text-right' : ''}`}>
                        <div className='font-bold'>{msg.sender.name}</div>
                        <div
                            className={`inline-block max-w-xs rounded-lg p-3 ${msg.sender.name === 'You' ? 'bg-green-100' : 'bg-white'}`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            <div
                className='flex h-[73px] items-center p-10'
                style={{ backgroundColor: '#f5f5f5', boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.05)' }}
            >
                <Popover content='Attach'>
                    <Button icon={<PaperClipOutlined />} className='mr-2 rounded-full p-2' />
                </Popover>

                <Popover content='Sticker'>
                    <Button icon={<SmileOutlined />} className='ml-2 mr-2 rounded-full p-2' />
                </Popover>
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Type your message here...'
                    className='rounded-5 mr-2 flex-1 p-2'
                />
                <Button className='h-[34px]' type='primary' icon={<SendOutlined />} onClick={handleSendMessage}>
                    Send
                </Button>
            </div>

            <Modal
                title='Video Call'
                open={isVideoCallModalVisible}
                onOk={handleVideoCallOk}
                onCancel={handleVideoCallCancel}
            >
                <p>Video call content goes here...</p>
            </Modal>

            <Modal
                title='Voice Call'
                open={isVoiceCallModalVisible}
                onOk={handleVoiceCallOk}
                onCancel={handleVoiceCallCancel}
            >
                <p>Voice call content goes here...</p>
            </Modal>
        </div>
    );
};

export default ChatPage;
