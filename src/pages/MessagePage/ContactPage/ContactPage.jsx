import { Menu } from 'antd';

import { Outlet, useNavigate } from 'react-router-dom';
const menuItems = [
    {
        key: 'friend-list',
        label: 'Danh sách bạn bè'
        // icon: <MailOutlined />
    },
    {
        key: 'groups',
        label: 'Danh sách cộng đồng'
        // icon: <MailOutlined />
    },
    {
        key: 'friend-request',
        label: 'Lời mời kết bạn'
        // icon: <MailOutlined />
    },
    {
        key: 'group-request',
        label: 'Lời mời vào cộng đồng'
        // icon: <MailOutlined />
    }
];
const ContactPage = () => {
    const navigate = useNavigate();
    return (
        <div className='flex'>
            <Menu items={menuItems} onClick={(e) => navigate(`/contact/${e.key}`)} />
            <div className='flex-1'>
                <Outlet />
            </div>
        </div>
    );
};

export default ContactPage;
