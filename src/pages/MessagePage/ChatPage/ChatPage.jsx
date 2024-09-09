import React, { useEffect, useState } from 'react'
import { Layout, Avatar, Button, Input, Typography } from 'antd'
import { VideoCameraOutlined, PhoneOutlined, MoreOutlined } from '@ant-design/icons'
import { getSocket } from '../../../configs/socketInstance'
import './ChatPage.scss'

const { Content } = Layout
const { Text } = Typography

const ChatPage = () => {
    const socket = getSocket()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        socket.on('receive-message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage])
        })

        return () => {
            socket.off('receive-message')
        }
    }, [socket])

    const handleSendMessage = () => {
        if (message.trim()) {
            socket.emit('send-message', message)
            setMessages((prevMessages) => [...prevMessages, { content: message, sender: 'me' }])
            setMessage('')
        }
    }

    return (
        <Content className='chat-page'>
            <div className='chat-page__header'>
                <div className='chat-page__header__left'>
                    <Avatar size={40} src='https://via.placeholder.com/40' alt='avatar' />
                    <div className='chat-page__header__left__info'>
                        <Text strong>Horace Keene</Text>
                        <Text type='secondary'>Active 1m ago</Text>
                    </div>
                </div>
                <div className='chat-page__header__right'>
                    <Button shape='circle' icon={<VideoCameraOutlined />} />
                    <Button shape='circle' icon={<PhoneOutlined />} />
                    <Button shape='circle' icon={<MoreOutlined />} />
                </div>
            </div>

            <div className='chat-page__body'>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-page__body__message ${
                            msg.sender === 'me' ? 'chat-page__body__message--right' : 'chat-page__body__message--left'
                        }`}
                    >
                        <Avatar size={40} src='https://via.placeholder.com/40' alt='avatar' />
                        <div className='chat-page__body__message__content'>
                            <Text>{msg.content}</Text>
                            <Text type='secondary' className='chat-page__body__message__timestamp'>
                                Just Now
                            </Text>
                        </div>
                    </div>
                ))}
            </div>

            <div className='chat-page__footer'>
                <Input
                    placeholder='Type a message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className='chat-page__footer__input'
                    onPressEnter={handleSendMessage}
                />
                <Button type='primary' onClick={handleSendMessage}>
                    Send
                </Button>
            </div>
        </Content>
    )
}

export default ChatPage
