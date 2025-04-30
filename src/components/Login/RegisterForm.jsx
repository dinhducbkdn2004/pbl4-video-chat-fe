import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import useFetch from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import authApi from '../../apis/authApi';
import OTPModal from '../OTPModal/OTPModal';

const RegisterForm = () => {
    const navigate = useNavigate();
    const { isLoading, fetchData, contextHolder } = useFetch();
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [email, setEmail] = useState('');

    const onFinish = async (values) => {
        setEmail(values.email);

        try {
            const { isOk, data } = await fetchData(() => authApi.register(values));

            if (isOk) {
                setIsOtpVisible(true);
            }
        } catch (error) {
            console.log('Registration failed:', error);
        }
    };

    const handleOtpSuccess = () => {
        setIsOtpVisible(false);
        navigate('/login');
    };

    return (
        <>
            {contextHolder}
            <Form
                name='register'
                layout='vertical'
                className='w-full px-2'
                initialValues={{
                    remember: true
                }}
                requiredMark={false}
                onFinish={onFinish}
                autoComplete='on'
                size="middle"
            >
                <Form.Item
                    label={<span className="text-gray-600 font-medium">Full Name</span>}
                    name='name'
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your name!'
                        }
                    ]}
                >
                    <Input 
                        prefix={<UserOutlined className="text-gray-400" />} 
                        placeholder='Enter your full name'
                        className="rounded-md py-1 text-gray-700" 
                    />
                </Form.Item>

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
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-gray-600 font-medium">Password</span>}
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your password!'
                        }
                    ]}
                >
                    <Input.Password 
                        prefix={<LockOutlined className="text-gray-400" />} 
                        placeholder='Enter your password'
                        className="rounded-md py-1 text-gray-700" 
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-gray-600 font-medium">Confirm Password</span>}
                    name='confirmPassword'
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!'
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            }
                        })
                    ]}
                >
                    <Input.Password 
                        prefix={<LockOutlined className="text-gray-400" />} 
                        placeholder='Repeat your password'
                        className="rounded-md py-1 text-gray-700" 
                    />
                </Form.Item>

                <Form.Item className="mt-2">
                    <Button
                        type='primary'
                        htmlType='submit'
                        loading={isLoading}
                        className='h-9 w-full rounded-md bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors font-medium text-sm'
                    >
                        Sign up
                    </Button>
                </Form.Item>
            </Form>

            <OTPModal
                isVisible={isOtpVisible}
                email={email}
                handleCloseOtpModal={() => setIsOtpVisible(false)}
                onSuccess={handleOtpSuccess}
            />
        </>
    );
};

export default RegisterForm;
