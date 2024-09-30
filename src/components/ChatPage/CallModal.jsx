import React, { useState } from 'react';
import { Button, Modal, Popover } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const CallModal = () => {
    const { chatRoomId } = useParams();
    const [isVideoCallModalVisible, setIsVoiceCallModalVisible] = useState(false);
    const toggleModalVisibility = (isVisible) => {
        setIsVoiceCallModalVisible(isVisible);
    };
    const handleOk = () => {
        const baseUrl = window.location.origin; // Get the base URL of your app
        const videoCallUrl = `${baseUrl}/video-call/${chatRoomId}?type=calling`; // Concatenate the video call route
        window.open(videoCallUrl, '_blank'); // Open the video call page in a new tab
        setIsVoiceCallModalVisible(false); // Close the modal
    };
    return (
        <>
            <Popover content='Video Call' overlayStyle={{ borderRadius: '8px' }}>
                <Button icon={<VideoCameraOutlined />} className='rounded-full p-3' onClick={toggleModalVisibility} />
            </Popover>
            <Modal open={isVideoCallModalVisible} onCancel={() => setIsVoiceCallModalVisible(false)} onOk={handleOk}>
                <p>Voice call content goes here...</p>
            </Modal>
        </>
    );
};

export default CallModal;
