import { TbPhoneCall, TbWorldSearch } from 'react-icons/tb';
import { Avatar, Badge, Dropdown, Layout, Menu } from 'antd';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { BiMessageSquareDots } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';

import { LuContact2 } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

import { handleLogout } from '../../components/Logout';
import './SideBar.scss';

import { authSelector } from '../../redux/features/auth/authSelections';
import { useSelector } from 'react-redux';
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
            key: 'setting',
            icon: <IoSettingsOutline size={15} />,
            label: <span>Setting</span>
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
            icon: <TbWorldSearch size={20} />,
            className: 'custom-menu-item'
        }
    ];

    return (
        <Sider width={72} className='sidebar-container'>
            <div className='logo-container'>
                <img src={logo} alt='Logo' className='logo' />
            </div>
            <Menu
                mode='vertical'
                className='custom-menu'
                onClick={(e) => {
                    navigate(e.key);
                }}
                items={sidebarItems}
            />
            <div className='bottom-menu-items'>
                <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                    <div className='avatar-container'>
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
