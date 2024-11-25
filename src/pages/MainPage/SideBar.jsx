import React, { useState, useEffect } from 'react';
import { TbPhoneCall, TbUserSearch } from 'react-icons/tb';
import { Avatar, Badge, Dropdown, Layout, Menu } from 'antd';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { BiMessageSquareDots } from 'react-icons/bi';
import { IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuContact2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../components/Logout';
import { authSelector } from '../../redux/features/auth/authSelections';
import notificationsApi from '../../apis/notificationApi';
import { useSelector } from 'react-redux';
import assets from '../../assets/index';
import './SideBar.css';
import NotificationSidebar from '../../components/Notification/NotificationSidebar';
import ChangePasswordForm from '../../components/ChangePasswordForm';
const { Sider } = Layout;

const Sidebar = () => {
    const [isNotificationSidebarVisible, setNotificationSidebarVisible] = useState(false);
    const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
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

    const unreadCount = notifications.filter((item) => !item.isRead).length;

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
                <Badge count={unreadCount}>
                    <IoNotificationsOutline size={20} />
                </Badge>
            ),
            className: 'custom-menu-item',
            onClick: () => setNotificationSidebarVisible(true)
        }
    ];

    const handleMenuClick = (e) => {
        if (e.key !== 'notification') {
            navigate(e.key);
        }
    };

    return (
        <>
            <Sider
                width={72}
                className='flex h-full flex-col items-center justify-between border-r border-slate-200 bg-white-default py-4'
            >
                <div className='mb-5 flex items-center justify-center'>
                    <img
                        src={assets.Designer}
                        alt='Logo'
                        className='h-12 w-12 cursor-pointer rounded-full border border-slate-200'
                        onClick={() => navigate('/message')}
                    />
                </div>
                <Menu
                    mode='vertical'
                    className='flex flex-grow flex-col items-center justify-start bg-white-default'
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
            {isNotificationSidebarVisible && (
                <NotificationSidebar onClose={() => setNotificationSidebarVisible(false)} />
            )}
            <ChangePasswordForm
                visible={isChangePasswordVisible}
                onClose={() => setChangePasswordVisible(false)}
            />
        </>
    );
};

export default Sidebar;