import React from 'react';
import { Button, Input, Popover } from 'antd';
import { PaperClipOutlined, SmileOutlined, SendOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({
    message,
    setMessage,
    handleSendMessage,
    handleEmojiClick,
    isEmojiPickerVisible,
    setIsEmojiPickerVisible
}) => (
    <div
        className='flex h-[73px] items-center p-10'
        style={{ backgroundColor: '#f5f5f5', boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.05)' }}
    >
        <Popover content='Attach'>
            <Button icon={<PaperClipOutlined />} className='mr-2 rounded-full p-2' />
        </Popover>

        <Popover content='Sticker'>
            <Popover
                content={<EmojiPicker onEmojiClick={handleEmojiClick} />}
                trigger='click'
                open={isEmojiPickerVisible}
                onOpenChange={(visible) => setIsEmojiPickerVisible(visible)}
            >
                <Button icon={<SmileOutlined />} className='ml-2 mr-2 rounded-full p-2' />
            </Popover>
        </Popover>
        <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder='Type your message here...'
            className='rounded-5 mr-2 flex-1 p-2'
        />
        <Button className='h-[34px]' type='primary' icon={<SendOutlined />} onClick={handleSendMessage}>
            Send
        </Button>
    </div>
);

export default MessageInput;
