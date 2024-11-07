import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Avatar, Badge, Button, Image, Spin } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { getLastName, truncateString } from '../helpers/utils';
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
                return { content: message.content, hasBackground: true };

            case 'Picture':
                return {
                    content: (
                        <Image
                            src={message.fileUrl}
                            alt='Picture'
                            style={{ maxWidth: '200px', borderRadius: '10px' }}
                        />
                    ),
                    hasBackground: false
                };

            case 'Video':
                return {
                    content: (
                        <video controls style={{ maxWidth: '300px', borderRadius: '10px' }}>
                            <source src={message.fileUrl} type='video/mp4' />
                            Your browser does not support the video tag.
                        </video>
                    ),
                    hasBackground: false
                };

            case 'Document':
                return {
                    content: (
                        <div className='document-message'>
                            <div className='file-details mb-1 flex'>
                                <p>{message.content || 'Document File'}</p>
                            </div>
                            <Button type='primary' href={message.fileUrl} target='_blank' rel='noopener noreferrer'>
                                <PaperClipOutlined style={{ fontSize: '20px', color: '#ffffff' }} />
                                Download ({(message.fileSize / 1024).toFixed(1)} KB)
                            </Button>
                        </div>
                    ),
                    hasBackground: true
                };

            case 'Link':
                return {
                    content: isLoading ? (
                        <Spin />
                    ) : (
                        <div className='link-preview'>
                            <a href={message.content} target='_blank' className='link-title'>
                                {truncateString(message.content, 40)}
                            </a>
                            {seoData?.image && <img src={seoData?.image} alt='SEO preview' className='link-image' />}
                            <div className='link-details'>
                                <h3 className='link-heading'>{seoData?.title}</h3>
                                <p className='link-description'>{seoData?.description}</p>
                            </div>
                        </div>
                    ),
                    hasBackground: true
                };

            default:
                return { content: null, hasBackground: true };
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

    const { content, hasBackground } = checkMessageType(msg);

    return (
        <div className={`mb-4 flex ${sender._id === currentUser._id ? 'justify-end' : ''}`}>
            {sender._id !== currentUser._id && (
                <div className='mb-5 mr-2 flex items-end'>
                    <Badge
                        dot
                        offset={[-5, 28]}
                        color={onlineUsers.find((onlineUser) => onlineUser._id === sender._id) ? '#52c41a' : '#d9d9d9'}
                        size='small'
                    >
                        <Avatar src={sender.avatar} className='avatar' />
                    </Badge>
                </div>
            )}
            <div className={`flex flex-col ${sender._id === currentUser._id ? 'items-end' : 'items-start'}`}>
                <div className='mb-1 text-xs font-medium' style={{ fontSize: '12px' }}>
                    {getLastName(sender.name)}
                </div>
                <div
                    className={`inline-block max-w-xs rounded-2xl px-4 py-2 text-sm ${
                        hasBackground
                            ? sender._id === currentUser._id
                                ? 'ml-auto bg-blue text-white-default'
                                : 'text-black mr-auto bg-white-dark'
                            : ''
                    }`}
                >
                    {content}
                </div>
                <div className='text-gray-500 mt-1 flex items-center text-xs' style={{ fontSize: '10px' }}>
                    <span>{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {/* {sender._id === currentUser._id && (
                        <>
                            <CheckCircleTwoTone className='ml-1' />
                        </>
                    )} */}
                </div>
            </div>
            {sender._id === currentUser._id && (
                <div className='mb-5 ml-1 flex items-end'>
                    <Badge dot offset={[-5, 28]} color={'#52c41a'} size='small'>
                        <Avatar src={sender.avatar} className='avatar' />
                    </Badge>
                </div>
            )}
        </div>
    );
};

MessageComponent.propTypes = {
    msg: PropTypes.object.isRequired
};

export default MessageComponent;
