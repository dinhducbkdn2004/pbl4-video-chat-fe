import { useState } from 'react';
import { Button, Input, Popover, Upload, Spin } from 'antd';
import { PaperClipOutlined, SmileOutlined, SendOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import useFetch from '../../hooks/useFetch';
import RoomChatApi from '../../apis/RoomChatApi';
import uploadApi from '../../apis/uploadApi';
import { useParams } from 'react-router-dom';
import typeOfFile from '../../helpers/typeOfFile';

const MessageInput = () => {
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [fileList, setFileList] = useState([]); 
    const { chatRoomId: currentChatRoomId } = useParams();
    const { fetchData } = useFetch({ showError: false, showSuccess: false });

    const handleSendMessage = async () => {
        if (message.length > 0)
            await fetchData(() =>
                RoomChatApi.createMessage(message, currentChatRoomId, message.startsWith('http') ? 'Link' : 'Text')
            );

        if (fileList.length > 0) {
            for (const file of fileList) {
                const uploadResponse = await uploadApi.upload(file.originFileObj, 'chat_files');
                const fileUrl = uploadResponse.data.url;
                await fetchData(() => RoomChatApi.createMessage(file.originFileObj.name, currentChatRoomId, typeOfFile(file), fileUrl));
            }
        }

        setMessage('');
        setFileList([]);
    };

    const handleEmojiClick = (emojiObject, event) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    const handleFileChange = ({ file, fileList }) => {
        setFileList(fileList); // Update file list state to display selected files
    };

    return (
        <div
            className='flex flex-col p-4'
            style={{ backgroundColor: '#f5f5f5', boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.05)' }}
        >
            {fileList.length > 0 && (
                <div className='mb-2'>
                    <Upload
                        listType='picture' 
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={() => false}
                    />
                </div>
            )}

            <div className='flex items-center'>
                <Popover content='Attach'>
                    <Upload
                        action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
                        listType='picture'
                        fileList={fileList}
                        onChange={handleFileChange}
                        showUploadList={false}
                        beforeUpload={() => false}
                        multiple
                    >
                        <Button icon={<PaperClipOutlined />} className='mr-2 rounded-full p-2' />
                    </Upload>
                </Popover>

                <Popover content='Emoji'>
                    <Popover
                        content={
                            <EmojiPicker
                                width={280}
                                height={280}
                                disableAutoFocus={true}
                                skinTonesDisabled
                                searchDisabled
                                previewConfig={{ showPreview: false }}
                                emojiStyle='google'
                                onEmojiClick={handleEmojiClick}
                            />
                        }
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
        </div>
    );
};

export default MessageInput;