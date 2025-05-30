import React from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import authApi from '../apis/authApi';
import useFetch from '../hooks/useFetch';

const ChangePasswordForm = ({ visible, open, onClose }) => {
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: false, showError: false });
    // Use open prop if available, otherwise fall back to visible for backwards compatibility
    const isOpen = open !== undefined ? open : visible;

    const handleFinish = async (values) => {
        const { oldPassword, newPassword } = values;
        const { data, isOk } = await fetchData(() => authApi.changePassword(oldPassword, newPassword));
        if (isOk) {
            notification.success({
                message: 'Change password successfully!',
                description: 'You have successfully changed your password!'
            });
            onClose();
        } else {
            notification.error({
                message: 'Change password failed!',
                description: 'Please check your old password!'
            });
        }
    };

    return (
        <Modal title='Change Password' open={isOpen} onCancel={onClose} footer={null}>
            {contextHolder}
            <Form onFinish={handleFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Form.Item
                    name='oldPassword'
                    label='Old Password'
                    rules={[{ required: true, message: 'Please input your old password!' }]}
                >
                    <Input.Password placeholder='Enter your old password' />
                </Form.Item>
                <Form.Item
                    name='newPassword'
                    label='New Password'
                    rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                    <Input.Password placeholder='Enter new password' />
                </Form.Item>
                <Form.Item
                    name='confirmPassword'
                    label='Confirm Password'
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm your new password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            }
                        })
                    ]}
                >
                    <Input.Password placeholder='Confirm new password' />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type='primary' htmlType='submit' loading={isLoading}>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordForm;
