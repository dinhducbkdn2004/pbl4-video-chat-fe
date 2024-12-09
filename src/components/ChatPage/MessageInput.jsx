import { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Input, Popover, Upload, Spin } from 'antd';
import { PaperClipOutlined, SmileOutlined, SendOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import useFetch from '../../hooks/useFetch';
import RoomChatApi from '../../apis/RoomChatApi';
import uploadApi from '../../apis/uploadApi';
import { useParams } from 'react-router-dom';
import typeOfFile from '../../helpers/typeOfFile';
import { useSocket } from '../../hooks/useSocket';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import { debounce } from 'lodash';

const MessageInput = () => {
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [fileList, setFileList] = useState([]);
    const { chatRoomId: currentChatRoomId } = useParams();
    const { fetchData } = useFetch({ showError: false, showSuccess: false });
    const { socket } = useSocket();
    const { user } = useSelector(authSelector);
    const isChangeMessageRef = useRef(false);

    const debounceEmitStop = useRef(
        debounce(() => {
            socket.emit('user:stop-change-message', { chatRoomId: currentChatRoomId, user });
            isChangeMessageRef.current = false;
        }, 2000)
    ).current;
    
    const handleChangeMessage = useCallback(
        (e) => {
            const newMessage = e.target.value;
            setMessage(newMessage);
    
            if (newMessage.length === 0) {
                if (isChangeMessageRef.current) {
                    socket.emit('user:stop-change-message', { chatRoomId: currentChatRoomId, user });
                    isChangeMessageRef.current = false;
                }
                debounceEmitStop.cancel();
            } else {
                if (!isChangeMessageRef.current) {
                    isChangeMessageRef.current = true;
                    socket.emit('user:change-message', { chatRoomId: currentChatRoomId, user });
                }
                debounceEmitStop();
            }
        },
        [currentChatRoomId, debounceEmitStop, socket, user]
    );
    const handleSendMessage = async () => {
        if (message.length > 0)
            fetchData(() =>
                RoomChatApi.createMessage(message, currentChatRoomId, message.startsWith('http') ? 'Link' : 'Text')
            );

        if (fileList.length > 0) {
            for (const file of fileList) {
                const uploadResponse = await uploadApi.upload(file.originFileObj, 'chat_files');
                const fileUrl = uploadResponse.data.url;
                await fetchData(() =>
                    RoomChatApi.createMessage(file.originFileObj.name, currentChatRoomId, typeOfFile(file), fileUrl)
                );
            }
        }

        setMessage('');
        setFileList([]);
        socket.emit('user:stop-change-message', { chatRoomId: currentChatRoomId, user });
    };

    const handleEmojiClick = (emojiObject, event) => {
        setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    };

    const handleFileChange = ({ file, fileList }) => {
        setFileList(fileList);
    };

    return (
        <div className='mb-8 mt-4 flex flex-col rounded-lg bg-white-default p-4 shadow-lg dark:bg-black-light dark:text-white-default'>
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
                        <Button icon={<PaperClipOutlined />} className='mr-2 rounded-full p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600' />
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
                        <Button icon={<SmileOutlined />} className='ml-2 mr-2 rounded-full p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600' />
                    </Popover>
                </Popover>

                <Input
                    value={message}
                    onChange={handleChangeMessage}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder='Type your message here...'
                    className='rounded-full mr-2 flex-1 p-2 bg-gray-100 dark:bg-gray-700 dark:text-white'
                />

                <Button className='h-[34px] rounded-full bg-blue-500 text-white hover:bg-blue-600' type='primary' icon={<SendOutlined />} onClick={handleSendMessage}>
                    Send
                </Button>
            </div>
        </div>
    );
};

export default MessageInput;