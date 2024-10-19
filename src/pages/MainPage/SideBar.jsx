import { TbPhoneCall } from 'react-icons/tb';
import { TbUserSearch } from 'react-icons/tb';

import { Avatar, Badge, Dropdown, Layout, Menu } from 'antd';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { BiMessageSquareDots } from 'react-icons/bi';
import { IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuContact2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../components/Logout';
import { authSelector } from '../../redux/features/auth/authSelections';
import { useSelector } from 'react-redux';
import assets from '../../assets/index';
import './SideBar.css';

const { Sider } = Layout;

const Sidebar = () => {
    const logout = handleLogout();
    const navigate = useNavigate();
    const { user } = useSelector(authSelector);

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
            key: 'call',
            icon: <TbPhoneCall size={20} />,
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
            icon: <IoNotificationsOutline size={20} />,
            className: 'custom-menu-item'
        },
        {
            key: 'setting',
            icon: <IoSettingsOutline size={20} />,
            className: 'custom-menu-item'
        }
    ];

    return (
        <Sider
            width={72}
            className='flex h-full flex-col items-center justify-between border-r border-slate-200 bg-white-default py-4'
        >
            <div className='mb-5 flex items-center justify-center'>
                <img
                    src={assets.logo_sidebar1}
                    alt='Logo'
                    className='h-9 w-9 cursor-pointer'
                    onClick={() => navigate('/message')}
                />
            </div>
            <Menu
                mode='vertical'
                className='flex flex-grow flex-col items-center justify-start bg-white-default'
                onClick={(e) => {
                    navigate(e.key);
                }}
                items={sidebarItems}
            />
            <div className='mt-auto flex flex-col items-center'>
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                    <div className='mt-4 flex cursor-pointer flex-col items-center'>
                        <Badge count={1} status='success'>
                            <Avatar size={46} src={user?.avatar} />
                        </Badge>
                    </div>
                </Dropdown>
            </div>
        </Sider>
    );
};

export default Sidebar;
