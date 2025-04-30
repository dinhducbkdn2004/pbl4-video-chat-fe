import { Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, TeamOutlined, UserAddOutlined, MenuOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

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
    const [isMobile, setIsMobile] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setShowSidebar(window.innerWidth >= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleMenuClick = (e) => {
        navigate(`/contact/${e.key}`);
        if (isMobile) {
            setShowSidebar(false);
        }
    };

    return (
        <div className='flex h-screen flex-col pl-2 md:flex-row'>
            {/* Mobile menu toggle */}
            {isMobile && (
                <div className='sticky rounded-lg    top-0 z-20 flex h-[50px] items-center justify-between bg-white-default px-4 dark:bg-black-light'>
                    <h2 className='text-lg font-bold text-blue'>Contacts</h2>
                    <MenuOutlined
                        className='cursor-pointer text-xl text-black-default dark:text-white-default'
                        onClick={() => setShowSidebar(!showSidebar)}
                    />
                </div>
            )}

            {/* Sidebar */}
            <div
                className={`${isMobile ? (showSidebar ? 'block' : 'hidden') : 'flex'} flex-col overflow-auto rounded-lg md:w-80 ${isMobile ? 'fixed left-0 right-0 top-[50px] z-50 h-auto max-h-[250px] shadow-lg' : 'h-screen'}`}
            >
                {!isMobile && (
                    <div className='sticky top-0 z-10 flex h-[65px] items-center justify-between rounded-lg bg-white-default p-4 dark:bg-black-light'>
                        <h2 className='ml-1 text-xl font-bold text-blue'>Contacts</h2>
                    </div>
                )}

                <Menu
                    items={menuItems}
                    onClick={handleMenuClick}
                    className='mt-3 overflow-auto rounded-lg bg-white-default dark:bg-black-light'
                />
            </div>

            {/* Main content */}
            <div className={`flex-1 ${isMobile ? 'ml-0 mt-2' : 'ml-4'}`}>
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
