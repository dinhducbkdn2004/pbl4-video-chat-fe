import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Avatar, Badge, Button, Image, Spin } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import { getLastName, truncateString } from '../helpers/utils';
import { authSelector } from '../redux/features/auth/authSelections';
import { useSocket } from '../hooks/useSocket';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useFetch from '../hooks/useFetch';
import messageApi from '../apis/messageApi';
import { FileIcon, defaultStyles } from 'react-file-icon';

const MessageComponent = ({ messages, isFirstMessage, isLastMessage }) => {
    const navigate = useNavigate();
    const { user: currentUser } = useSelector(authSelector);
    const { sender, createdAt } = messages[0];
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
                            style={{ maxWidth: '230px', borderRadius: '10px' }}
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

            case 'Document': {
                const fileExtension = message.fileUrl.split('.').pop();
                return {
                    content: (
                        <div className='flex items-center' style={{ maxWidth: '300px', borderRadius: '10px' }}>
                            <FileIcon extension={fileExtension} {...defaultStyles[fileExtension]} />
                            <div className='ml-5'>
                                <p className='mb-1 font-medium'>{message.content || 'Document File'}</p>
                                <Button type='primary' href={message.fileUrl} target='_blank' rel='noopener noreferrer'>
                                    <PaperClipOutlined style={{ fontSize: '25px', color: '#ffffff' }} />
                                    Download ({(message.fileSize / 1024).toFixed(1)} KB)
                                </Button>
                            </div>
                        </div>
                    ),
                    hasBackground: true
                };
            }

            case 'Link':
                return {
                    content: (
                        <div className='link-preview'>
                            <a href={message.content} target='_blank' className='link-title'>
                                {message.content.length > 200 ? truncateString(message.content, 50) : message.content}
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
            if (messages[0].type === 'Link') {
                const { data } = await fetchData(() => messageApi.fetchSEOData(messages[0].content));
                setSeoData(data);
            }
        })();
    }, [messages, fetchData]);

    return (
        <div className={`mb-4 flex ${sender._id === currentUser._id ? 'justify-end' : ''}`}>
            {sender._id !== currentUser._id && (
                <div className='mb-1 mr-2 flex items-end'>
                    <Badge
                        dot
                        offset={[-5, 28]}
                        color={onlineUsers.find((onlineUser) => onlineUser._id === sender._id) ? '#52c41a' : '#d9d9d9'}
                        size='small'
                    >
                        <Avatar src={sender.avatar} size={33} className='cursor-pointer' onClick={()=>{
                            navigate(`/user/${sender._id}`)
                        }} />
                    </Badge>
                </div>
            )}
            <div className={`flex flex-col ${sender._id === currentUser._id ? 'items-end' : 'items-start'}`}>
                {sender._id !== currentUser._id && (
                    <div className='ml-3 font-medium text-gray' style={{ fontSize: '12px' }}>
                        {getLastName(sender.name)}
                    </div>
                )}
                {messages.map((msg, index) => {
                    const { content, hasBackground } = checkMessageType(msg);
                    const isFirst = index === 0;
                    const isLast = index === messages.length - 1;
                    const borderRadiusClass =
                        isFirst && isLast
                            ? 'rounded-2xl'
                            : isFirst
                              ? sender._id === currentUser._id
                                  ? 'rounded-t-2xl rounded-bl-2xl rounded-br-md'
                                  : 'rounded-t-2xl rounded-br-2xl rounded-bl-md'
                              : isLast
                                ? sender._id === currentUser._id
                                    ? 'rounded-b-2xl rounded-tl-2xl rounded-tr-md'
                                    : 'rounded-b-2xl rounded-tr-2xl rounded-tl-md'
                                : sender._id === currentUser._id
                                  ? 'rounded-tl-2xl rounded-bl-2xl rounded-tr-md rounded-br-md'
                                  : 'rounded-tr-2xl rounded-br-2xl rounded-tl-md rounded-bl-md';

                    return (
                        <div
                            key={index}
                            className={`mb-1 inline-block max-w-xs px-4 py-2 text-sm ${borderRadiusClass} ${
                                hasBackground
                                    ? sender._id === currentUser._id
                                        ? 'ml-auto bg-blue text-white-default'
                                        : 'text-black mr-auto bg-white-dark'
                                    : ''
                            }`}
                            style={{ wordBreak: 'break-word' }}
                        >
                            {content}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

MessageComponent.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFirstMessage: PropTypes.bool,
    isLastMessage: PropTypes.bool
};

export default MessageComponent;
