import { Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

const menuItems = [
    {
        key: 'friend-list',
        label: 'Danh sách bạn bè'
    },
    {
        key: 'groups',
        label: 'Danh sách cộng đồng'
    },
    {
        key: 'friend-request',
        label: 'Lời mời kết bạn'
    },
    {
        key: 'group-request',
        label: 'Lời mời vào cộng đồng'
    }
];

const ContactPage = () => {
    const navigate = useNavigate();
    return (
        <div className='flex'>
            <Menu
                items={menuItems}
                onClick={(e) => navigate(`/contact/${e.key}`)}
                className='bg-white w-64 rounded-md shadow-md'
            />
            <div className='flex-1 p-4'>
                <Outlet />
            </div>
        </div>
    );
};

export default ContactPage;
