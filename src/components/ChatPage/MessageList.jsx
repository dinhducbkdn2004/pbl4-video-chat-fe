import React from 'react';
import { Avatar, Badge, Spin } from 'antd';
import { getLastName } from '../../helpers/utils';

const MessageList = ({ messages, members, currentUser, isLoadingMessages, messagesEndRef, chatId }) => (
    <div className='bg-white custom-scroll flex-1 overflow-y-auto p-5'>
        {isLoadingMessages ? (
            <div className='flex h-full items-center justify-center'>
                <Spin size='medium' className='custom-spinner' />
            </div>
        ) : (
            messages
                .filter((msg) => msg.chatRoom === chatId)
                .map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-4 flex items-end ${msg.sender._id === currentUser._id ? 'justify-end' : ''}`}
                    >
                        {msg.sender._id !== currentUser._id && (
                            <Badge
                                className='mr-2'
                                dot={members.find((member) => member._id === msg.sender._id)?.isOnline}
                                color='#52c41a'
                                size='small'
                                offset={[-5, 30]}
                            >
                                <Avatar src={msg.sender.avatar} className='avatar' />
                            </Badge>
                        )}
                        <div
                            className={`flex flex-col ${msg.sender._id === currentUser._id ? 'items-end' : 'items-start'}`}
                        >
                            <div className='mb-1 text-xs'>{getLastName(msg.sender.name)}</div>
                            <div
                                className={`inline-block max-w-xs rounded-2xl px-4 py-2 text-sm ${
                                    msg.sender._id === currentUser._id
                                        ? 'ml-auto bg-blue-500 text-white-default'
                                        : 'text-black mr-auto bg-green-defaut'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                        {msg.sender._id === currentUser._id && (
                            <Badge
                                className='ml-2'
                                dot={members.find((member) => member._id === msg.sender._id)?.isOnline}
                                color='#52c41a'
                                size='small'
                                offset={[-5, 30]}
                            >
                                <Avatar src={msg.sender.avatar} className='avatar' />
                            </Badge>
                        )}
                    </div>
                ))
        )}
        <div ref={messagesEndRef} />
    </div>
);

export default MessageList;
