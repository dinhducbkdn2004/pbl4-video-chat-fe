import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Avatar, Badge, Button, Image, Spin } from 'antd';
import { CheckCircleTwoTone, PaperClipOutlined } from '@ant-design/icons';
import { getLastName } from '../helpers/utils';
import { authSelector } from '../redux/features/auth/authSelections';
import { useSocket } from '../hooks/useSocket';
import { useEffect, useState } from 'react';

import useFetch from '../hooks/useFetch';
import messageApi from '../apis/messageApi';

const MessageComponent = ({ msg }) => {
    const { user: currentUser } = useSelector(authSelector);
    const { sender, createdAt } = msg;
    const { onlineUsers } = useSocket();
    const { isLoading, fetchData } = useFetch({ showError: false, showSuccess: false });
    const [seoData, setSeoData] = useState(null);
    const checkMessageType = (message) => {
        switch (message.type) {
            case 'Text':
                return message.content;

            case 'Picture':
                return (
                    <Image src={message.fileUrl} alt='Picture' style={{ maxWidth: '200px', borderRadius: '10px' }} />
                );

            case 'Video':
                return (
                    <video controls style={{ maxWidth: '300px', borderRadius: '10px' }}>
                        <source src={message.fileUrl} type='video/mp4' />
                        Your browser does not support the video tag.
                    </video>
                );

            case 'Document':
                return (
                    <div>
                        <p>{message.fileName || 'Download Document'}</p>
                        <Button
                            type='primary'
                            href={message.fileUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            icon={<PaperClipOutlined />}
                        >
                            Download
                        </Button>
                    </div>
                );

            case 'Link':
                return isLoading ? (
                    <Spin />
                ) : (
                    <div>
                        <a href={message.content} target='_blank'>
                            {message?.content}
                        </a>
                        <h2>{seoData?.title}</h2>

                        {seoData?.image && (
                            <img
                                src={seoData?.image}
                                alt='SEO preview'
                                style={{ maxWidth: '100px', marginBottom: '10px' }}
                            />
                        )}

                        <p>{seoData?.description}</p>
                    </div>
                );

            default:
                return null;
        }
    };
    useEffect(() => {
        (async () => {
            if (msg.type === 'Link') {
                const { data } = await fetchData(() => messageApi.fetchSEOData(msg.content));

                setSeoData(data);
            }
        })();
    }, [msg, fetchData]);

    return (
        <div className={`mb-4 flex ${sender._id === currentUser._id ? 'justify-end' : ''}`}>
            {sender._id !== currentUser._id && (
                <Badge
                    className='mr-2 flex items-center'
                    dot={onlineUsers.find((onlineUser) => onlineUser._id === sender._id)}
                    color='#52c41a'
                    size='small'
                    offset={[-5, 50]}
                >
                    <Avatar src={sender.avatar} className='avatar' />
                </Badge>
            )}
            <div className={`flex flex-col ${sender._id === currentUser._id ? 'items-end' : 'items-start'}`}>
                <div className='mb-1 text-xs font-medium' style={{ fontSize: '12px' }}>
                    {getLastName(sender.name)}
                </div>
                <div
                    className={`inline-block max-w-xs rounded-2xl px-4 py-2 text-sm ${
                        sender._id === currentUser._id
                            ? 'ml-auto bg-blue-500 text-white-default'
                            : 'text-black mr-auto bg-green-defaut'
                    }`}
                >
                    {checkMessageType(msg)}
                </div>
                <div className='text-gray-500 mt-1 flex items-center text-xs' style={{ fontSize: '10px' }}>
                    <span>{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {sender._id === currentUser._id && (
                        <>
                            <CheckCircleTwoTone className='ml-1' />
                        </>
                    )}
                </div>
            </div>
            {sender._id === currentUser._id && (
                <Badge className='ml-2 flex items-center' dot color='#52c41a' size='small' offset={[-5, 50]}>
                    <Avatar src={sender.avatar} className='avatar' />
                </Badge>
            )}
        </div>
    );
};

MessageComponent.propTypes = {
    msg: PropTypes.object.isRequired
};

export default MessageComponent;
