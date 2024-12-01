import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import authApi from '../apis/authApi';
import useFetch from '../hooks/useFetch';

const ChangePasswordForm = ({ visible, onClose }) => {
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: true, showError: true });

    const handleFinish = async (values) => {
        const { oldPassword, newPassword } = values;
        await fetchData(async () => {
            await authApi.changePassword(oldPassword, newPassword);
            onClose();
        });
    };

    return (
        <Modal title='Change Password' visible={visible} onCancel={onClose} footer={null}>
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
