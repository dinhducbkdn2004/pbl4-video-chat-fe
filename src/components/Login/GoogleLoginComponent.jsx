import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import authApi from '../../apis/authApi';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { store } from '../../redux/store';
import { authActions } from '../../redux/features/auth/authSlice';

const GoogleLoginComponent = () => {
    const navigate = useNavigate();
    const { fetchData, contextHolder } = useFetch();

    const handleGoogleLogin = async (credentialResponse) => {
        const { isOk, data } = await fetchData(() => authApi.loginByGoogle(credentialResponse.credential));
        if (isOk) {
            const { accessToken, refreshToken } = data;
            store.dispatch(
                authActions.setCredentials({
                    accessToken,
                    refreshToken
                })
            );
            navigate('/');
        }
    };

    return (
        <div className='flex w-full justify-center px-2'>
            {contextHolder}
            <div className='w-full max-w-[240px]'>
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log('Login failed')}
                    size='large'
                    width='100%'
                    text='signin_with'
                    useOneTap
                    theme='outline'
                    shape='square'
                    locale='en'
                />
            </div>
        </div>
    );
};

export default GoogleLoginComponent;
