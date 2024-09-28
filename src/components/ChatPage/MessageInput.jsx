import { useState } from 'react';
import { Button, Input, Popover } from 'antd';
import { PaperClipOutlined, SmileOutlined, SendOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import useFetch from '../../hooks/useFetch';
import RoomChatApi from '../../apis/RoomChatApi';
import { useParams } from 'react-router-dom';

const MessageInput = () => {
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const [message, setMessage] = useState('');
    const { chatRoomId: currentChatRoomId } = useParams();
    const { fetchData } = useFetch({ showError: false, showSuccess: false });

    // Hàm gửi tin nhắn
    const handleSendMessage = async () => {
        if (!message.trim()) return; // Kiểm tra xem tin nhắn có nội dung hay không
        await fetchData(() => RoomChatApi.createMessage(message, currentChatRoomId, 'Text', null));
        setMessage(''); // Xoá tin nhắn sau khi gửi
    };

    // Hàm chọn emoji
    const handleEmojiClick = (emojiObject) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Thêm emoji vào tin nhắn
    };

    return (
        <div
            className='flex h-[73px] items-center p-10'
            style={{ backgroundColor: '#f5f5f5', boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.05)' }}
        >
            <Popover content='Attach'>
                <Button icon={<PaperClipOutlined />} className='mr-2 rounded-full p-2' />
            </Popover>

            <Popover content='Emoji'>
                <Popover
                    content={<EmojiPicker onEmojiClick={(event, emojiObject) => handleEmojiClick(emojiObject)} />}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} // Gửi tin nhắn khi nhấn Enter
                placeholder='Type your message here...'
                className='rounded-5 mr-2 flex-1 p-2'
            />

            <Button className='h-[34px]' type='primary' icon={<SendOutlined />} onClick={handleSendMessage}>
                Send
            </Button>
        </div>
    );
};

export default MessageInput;
