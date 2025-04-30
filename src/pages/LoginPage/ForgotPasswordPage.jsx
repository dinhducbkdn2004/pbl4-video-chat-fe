import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Typography, Space, Card, notification } from 'antd';
import { MailOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import useFetch from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import authApi from '../../apis/authApi';
import OTPModal from '../../components/OTPModal/OTPModal';
import asset from '../../assets';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { isLoading, fetchData, contextHolder } = useFetch();
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [formState, setFormState] = useState({
        email: '',
        isEmailVerified: false,
        password: '',
        confirmPassword: ''
    });

    const handleEmailSubmit = useCallback(
        async (values) => {
            setFormState((prevState) => ({ ...prevState, email: values.email }));
            const { isOk, data } = await fetchData(() => authApi.forgotPassword(values.email));
            if (isOk) {
                setIsOtpVisible(true);
            }
        },
        [fetchData]
    );

    const handleOtpSuccess = useCallback((otp) => {
        setIsOtpVisible(false);
        setFormState((prevState) => ({
            ...prevState,
            isEmailVerified: true,
            otp: otp
        }));
    }, []);

    const handlePasswordSubmit = useCallback(async () => {
        const { email, password, confirmPassword } = formState;
        const otp = localStorage.getItem('verifiedOtp');
        const { isOk, data } = await fetchData(() => authApi.resetPassword(email, otp, password, confirmPassword));
        if (isOk) {
            localStorage.removeItem('verifiedOtp');
            notification.success({
                message: 'Password Changed',
                description: 'Your password has been successfully changed. Redirecting to login page...',
                duration: 4
            });
            setTimeout(() => {
                navigate('/login');
            }, 4000);
        }
    }, [fetchData, formState, navigate]);

    return (
        <>
            {contextHolder}
            <div
                className='flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4'
                style={{ backgroundImage: `url(${asset.bg})` }}
            >
                <Card
                    className='w-full max-w-sm overflow-hidden rounded-lg shadow-md'
                    style={{
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                    }}
                    bodyStyle={{ padding: '20px' }}
                >
                    <div className="flex items-center mb-3">
                        <Button 
                            type="text" 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate('/login')}
                            className="p-0 flex items-center text-gray-500 hover:text-blue-600"
                            size="small"
                        >
                            <span className="ml-1">Back to Login</span>
                        </Button>
                    </div>
                    
                    <Space direction='vertical' size='middle' className='w-full'>
                        <Title level={3} className='text-center mt-1 mb-0 text-gray-700'>
                            {formState.isEmailVerified ? 'Reset Password' : 'Forgot Password'}
                        </Title>
                        <Text className='text-gray-500 text-center block mb-4 text-sm'>
                            {formState.isEmailVerified
                                ? 'Enter your new password.'
                                : 'Enter your email address to receive a verification code.'}
                        </Text>
                        <Form
                            name='forgot-password'
                            layout='vertical'
                            onFinish={formState.isEmailVerified ? handlePasswordSubmit : handleEmailSubmit}
                            autoComplete='on'
                            className='w-full'
                            size="middle"
                            requiredMark={false}
                        >
                            {!formState.isEmailVerified && (
                                <Form.Item
                                    label={<span className="text-gray-600 font-medium">Email</span>}
                                    name='email'
                                    rules={[
                                        {
                                            required: true,
                                            type: 'email',
                                            message: 'Please enter a valid email!'
                                        }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="text-gray-400" />}
                                        placeholder='Enter your email'
                                        className="rounded-md py-1 text-gray-700"
                                        onChange={(e) =>
                                            setFormState((prevState) => ({
                                                ...prevState,
                                                email: e.target.value
                                            }))
                                        }
                                    />
                                </Form.Item>
                            )}

                            {formState.isEmailVerified && (
                                <>
                                    <Form.Item
                                        label={<span className="text-gray-600 font-medium">New Password</span>}
                                        name='password'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your new password!'
                                            }
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="text-gray-400" />}
                                            placeholder='Enter new password'
                                            className="rounded-md py-1 text-gray-700"
                                            onChange={(e) =>
                                                setFormState((prevState) => ({
                                                    ...prevState,
                                                    password: e.target.value
                                                }))
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label={<span className="text-gray-600 font-medium">Confirm Password</span>}
                                        name='confirmPassword'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please confirm your new password!'
                                            }
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="text-gray-400" />}
                                            placeholder='Confirm new password'
                                            className="rounded-md py-1 text-gray-700"
                                            onChange={(e) =>
                                                setFormState((prevState) => ({
                                                    ...prevState,
                                                    confirmPassword: e.target.value
                                                }))
                                            }
                                        />
                                    </Form.Item>
                                </>
                            )}

                            <Form.Item className="mt-3">
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    loading={isLoading}
                                    block
                                    className='h-9 w-full rounded-md bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors font-medium text-sm'
                                >
                                    {formState.isEmailVerified ? 'Reset Password' : 'Continue'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Space>
                </Card>
            </div>

            <OTPModal
                isVisible={isOtpVisible}
                email={formState.email}
                handleCloseOtpModal={() => setIsOtpVisible(false)}
                onSuccess={handleOtpSuccess}
            />
        </>
    );
};

export default ForgotPassword;
