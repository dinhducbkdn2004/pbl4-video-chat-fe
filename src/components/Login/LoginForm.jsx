import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import useFetch from '../../hooks/useFetch';
import { authActions } from '../../redux/features/auth/authSlice';
import authApi from '../../apis/authApi';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { store } from '../../redux/store';
import { useState } from 'react';
import OTPModal from '../OTPModal/OTPModal';
import GoogleLoginComponent from './GoogleLoginComponent';

const LoginForm = () => {
    const navigate = useNavigate();
    const { isLoading, fetchData, contextHolder } = useFetch();
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [email, setEmail] = useState('');

    const onFinish = async (values) => {
        setEmail(values.email);
        try {
            const { isOk, data, message } = await fetchData(() => authApi.login(values));

            if (isOk) {
                const { accessToken, refreshToken } = data;
                store.dispatch(
                    authActions.setCredentials({
                        accessToken,
                        refreshToken
                    })
                );
                navigate('/');
            } else if (message.includes("Your account hasn't been verified")) {
                setIsOtpVisible(true);
            }
        } catch (error) {
            //console.log('Login failed:', error);
        }
    };

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        navigate('/forgot-password');
    };

    const handleOtpSuccess = () => {
        setIsOtpVisible(false);
        navigate('/');
    };

    return (
        <>
            {contextHolder}
            <div className={isOtpVisible ? 'pointer-events-none blur-sm filter' : ''}>
                <Form
                    name='login'
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

                    <Form.Item>
                        <div className='flex flex-wrap items-center justify-between'>
                            <Form.Item name='remember' valuePropName='checked' noStyle>
                                <Checkbox className="text-gray-600">Remember me</Checkbox>
                            </Form.Item>
                            <a
                                className='text-blue-500 hover:text-blue-700 transition-colors font-medium'
                                href=''
                                onClick={handleForgotPasswordClick}
                            >
                                Forgot password?
                            </a>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            loading={isLoading}
                            className='h-9 w-full rounded-md bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors font-medium text-sm'
                        >
                            Sign in
                        </Button>
                    </Form.Item>

                    <div className='relative my-4 flex items-center'>
                        <div className='border-gray-200 flex-grow border-t'></div>
                        <span className='text-gray-400 bg-white px-3 text-xs'>Or sign in with</span>
                        <div className='border-gray-200 flex-grow border-t'></div>
                    </div>
                </Form>
            </div>
            <GoogleLoginComponent />
            <OTPModal
                isVisible={isOtpVisible}
                email={email}
                handleCloseOtpModal={() => setIsOtpVisible(false)}
                onSuccess={handleOtpSuccess}
            />
        </>
    );
};

export default LoginForm;
