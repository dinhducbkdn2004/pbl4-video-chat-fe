import React, { useState } from 'react';
import { Button, Modal, Popover } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';

const CallModal = () => {
    const [isVideoCallModalVisible, setIsVoiceCallModalVisible] = useState(false);
    const toggleModalVisibility = (isVisible) => {
        setIsVoiceCallModalVisible(isVisible);
    };
    return (
        <>
            <Popover content='Video Call' overlayStyle={{ borderRadius: '8px' }}>
                <Button icon={<VideoCameraOutlined />} className='rounded-full p-3' onClick={toggleModalVisibility} />
            </Popover>
            <Modal open={isVideoCallModalVisible} onCancel={() => setIsVoiceCallModalVisible(false)}>
                <p>Voice call content goes here...</p>
            </Modal>
        </>
    );
};

export default CallModal;
