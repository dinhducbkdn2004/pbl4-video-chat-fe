import { LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthTabs = () => {
    const items = [
        {
            key: '1',
            label: (
                <span className='text-gray-600 flex items-center font-medium'>
                    <LoginOutlined style={{ marginRight: '8px' }} />
                    <span className='inline'>Login</span>
                </span>
            ),
            children: <LoginForm />
        },
        {
            key: '2',
            label: (
                <span className='text-gray-600 flex items-center font-medium'>
                    <UserAddOutlined style={{ marginRight: '8px' }} />
                    <span className='inline'>Register</span>
                </span>
            ),
            children: <RegisterForm />
        }
    ];

    return (
        <div className='flex w-full justify-center'>
            <Tabs
                defaultActiveKey='1'
                centered
                items={items}
                className='w-full max-w-md'
                size='middle'
                tabBarStyle={{
                    marginBottom: '10px',
                    fontWeight: 500,
                    color: '#6B7280'
                }}
            />
        </div>
    );
};

export default AuthTabs;
