import { Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, TeamOutlined, UserAddOutlined, GroupOutlined } from '@ant-design/icons';

const menuItems = [
    {
        key: 'friend-list',
        label: 'Friend List',
        icon: <UserOutlined className='mr-2' />
    },
    {
        key: 'groups-list',
        label: 'Community List',
        icon: <TeamOutlined className='mr-2' />
    },
    {
        key: 'friend-request',
        label: 'Friend Requests',
        icon: <UserAddOutlined className='mr-2' />
    }
];

const ContactPage = () => {
    const navigate = useNavigate();
    const currentItem = menuItems.find((item) => item.key === window.location.pathname.split('/').pop());

    return (
        <div className='flex h-screen'>
            <div className='flex h-screen w-80 flex-col overflow-auto rounded-lg'>
                <div className='sticky top-0 z-10 flex h-[65px] items-center justify-between rounded-lg bg-white-default p-4 dark:bg-black-light'>
                    <h2 className='ml-1 text-xl font-bold text-blue'>Contacts</h2>
                </div>
                <Menu
                    items={menuItems}
                    onClick={(e) => navigate(`/contact/${e.key}`)}
                    className='mt-3 overflow-auto rounded-lg bg-white-default dark:bg-black-light'
                />
            </div>
            <div className='ml-4 flex flex-1 flex-col'>
                <div className='border-gray-300 sticky top-0 z-10 mb-3 flex h-[65px] items-center justify-between rounded-lg bg-white-default p-4 dark:bg-black-light'>
                    <h2 className='p-1 text-lg font-bold dark:text-white-dark'>
                        {currentItem?.icon} {currentItem?.label}
                    </h2>
                </div>
                <div className='flex-1'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
