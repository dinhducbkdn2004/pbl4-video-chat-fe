import React, { useState, useEffect } from 'react';
import { TbPhoneCall, TbUserSearch } from 'react-icons/tb';
import { Avatar, Badge, Button, Dropdown, Layout, Menu } from 'antd';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { BiMessageSquareDots } from 'react-icons/bi';
import { FiSun } from 'react-icons/fi';
import PropTypes from 'prop-types';

import { IoNotificationsOutline, IoSettingsOutline, IoMoonSharp } from 'react-icons/io5';
import { LuContact2 } from 'react-icons/lu';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleLogout } from '../../components/Logout';
import { authSelector } from '../../redux/features/auth/authSelections';
import notificationsApi from '../../apis/notificationApi';
import { useSelector } from 'react-redux';
import assets from '../../assets/index';
import './SideBar.css';
import NotificationSidebar from '../../components/Notification/NotificationSidebar';
import ChangePasswordForm from '../../components/ChangePasswordForm';
const { Sider } = Layout;

const Sidebar = ({ setIsDarkMode, isDarkMode, isMobile = false }) => {
    const [isNotificationSidebarVisible, setNotificationSidebarVisible] = useState(false);
    const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [theme, setTheme] = useState('light');
    const location = useLocation();
    const logout = handleLogout();
    const navigate = useNavigate();
    const { user } = useSelector(authSelector);

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data, isOk } = await notificationsApi.getAll();
            if (isOk) setNotifications(data);
        };
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const unreadCount = notifications.filter((item) => !item.isRead).length;

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map((notification) => ({
            ...notification,
            isRead: true
        }));
        setNotifications(updatedNotifications);
    };

    const handleNotificationClick = () => {
        setNotificationSidebarVisible(true);
        markAllAsRead();
    };

    const handleThemeSwitch = () => {
        setIsDarkMode(!isDarkMode);
    };

    const menuItems = [
        {
            key: 'profile',
            icon: <Avatar src={user?.avatar} />,
            label: <span>Profile</span>,
            onClick: () => {
                navigate(`/user/${user?._id}`);
            }
        },
        {
            key: 'dark-mode',
            icon: isDarkMode ? <FiSun size={15} /> : <IoMoonSharp size={15} />,
            label: <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>,
            onClick: handleThemeSwitch
        },
        {
            key: 'change-password',
            icon: <IoSettingsOutline size={15} />,
            label: <span>Change Password</span>,
            onClick: () => setChangePasswordVisible(true)
        },
        {
            key: 'logout',
            icon: <RiLogoutCircleRLine size={15} />,
            label: <span>Logout</span>,
            onClick: logout
        }
    ];

    const sidebarItems = [
        {
            key: 'message',
            icon: <BiMessageSquareDots size={20} />,
            className: 'custom-menu-item'
        },
        {
            key: 'contact/friend-list',
            icon: <LuContact2 size={20} />,
            className: 'custom-menu-item'
        },
        {
            key: 'search/users',
            icon: <TbUserSearch size={20} />,
            className: 'custom-menu-item'
        },
        {
            key: 'notification',
            icon: (
                <Badge dot={unreadCount > 0} offset={[-3, 3]}>
                    <IoNotificationsOutline size={20} />
                </Badge>
            ),
            className: 'custom-menu-item',
            onClick: handleNotificationClick
        }
    ];

    const handleMenuClick = (e) => {
        if (e.key !== 'notification') {
            navigate(e.key);
        }
    };

    return (
        <>
            {/* Sidebar - only rendered on non-mobile devices */}
            <div className='z-50 mr-0 h-full p-4 pr-0'>
                <Sider
                    width={isMobile ? 60 : 72}
                    className='sidebar-container flex h-full flex-col items-center justify-between rounded-lg bg-white-default py-2 dark:bg-black-light'
                    trigger={null}
                >
                    <div className='mb-5 flex items-center justify-center'>
                        <img
                            src={assets.Designer}
                            alt='Logo'
                            className='h-12 w-12 cursor-pointer rounded-full'
                            onClick={() => {
                                navigate('/message');
                            }}
                        />
                    </div>
                    <Menu
                        mode='vertical'
                        className='flex flex-grow flex-col items-center justify-start bg-white-default dark:bg-black-light dark:text-white-default'
                        onClick={handleMenuClick}
                        items={sidebarItems}
                    />
                    <div className='mt-auto flex flex-col items-center'>
                        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                            <div className='mt-4 flex cursor-pointer flex-col items-center'>
                                <Avatar size={46} src={user?.avatar} />
                            </div>
                        </Dropdown>
                    </div>
                </Sider>
            </div>

            {isNotificationSidebarVisible && (
                <NotificationSidebar
                    onClose={() => setNotificationSidebarVisible(false)}
                    markAllAsRead={markAllAsRead}
                />
            )}
            <ChangePasswordForm open={isChangePasswordVisible} onClose={() => setChangePasswordVisible(false)} />
        </>
    );
};

Sidebar.propTypes = {
    setIsDarkMode: PropTypes.func.isRequired,
    isDarkMode: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool
};

export default Sidebar;
