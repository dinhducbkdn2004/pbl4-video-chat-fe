import { Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

const menuItems = [
    {
        key: 'users',
        label: 'Tìm kiếm người dùng',
        icon: <UserOutlined className='mr-2' />
    },
    {
        key: 'groups',
        label: 'Tìm kiếm cộng đồng',
        icon: <TeamOutlined className='mr-2' />
    }
];

const SearchPage = () => {
    const navigate = useNavigate();
    const currentItem = menuItems.find((item) => item.key === window.location.pathname.split('/').pop());

    return (
        <div className='flex h-screen'>
            <div className='flex h-screen w-80 flex-col overflow-auto rounded-lg'>
                <div className='sticky top-0 z-10 flex h-[65px] items-center justify-between rounded-lg bg-white-default p-4 dark:bg-black-light'>
                    <h2 className='ml-1 text-xl font-bold text-blue'>Search</h2>
                </div>
                <Menu
                    items={menuItems}
                    onClick={(e) => navigate(`/search/${e.key}`)}
                    className='mt-3 overflow-auto rounded-lg bg-white-default dark:bg-black-light'
                    defaultSelectedKeys={['users']}
                />
            </div>
            <div className='ml-4 flex flex-1 flex-col'>
                <div className='border-gray-300 sticky top-0 z-10 mb-3 flex h-[65px] items-center justify-between rounded-lg bg-white-default p-4 dark:bg-black-light'>
                    <h2 className='text-lg p-1 font-bold dark:text-white-dark'>
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

export default SearchPage;
