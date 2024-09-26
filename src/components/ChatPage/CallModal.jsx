import React from 'react';
import { Modal } from 'antd';

const CallModal = ({ title, isVisible, handleOk, handleCancel, children }) => (
    <Modal title={title} open={isVisible} onOk={handleOk} onCancel={handleCancel}>
        {children}
    </Modal>
);

export default CallModal;
