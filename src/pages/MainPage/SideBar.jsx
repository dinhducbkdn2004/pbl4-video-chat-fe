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

    const menu = (
        <Menu>
            <Menu.Item key='setting'>
                <IoSettingsOutline size={15} />
                <span>Setting</span>
            </Menu.Item>
            <Menu.Item key='logout' onClick={logout}>
                <RiLogoutCircleRLine size={15} /> <span>Logout</span>
            </Menu.Item>
        </Menu>
    );

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
            >
                <Menu.Item key='message' icon={<BiMessageSquareDots size={20} />} className='custom-menu-item' />
                <Menu.Item key='call' icon={<TbPhoneCall size={20} />} className='custom-menu-item' />
                <Menu.Item key='contact' icon={<LuContact2 size={20} />} className='custom-menu-item' />
                <Menu.Item key='search' icon={<TbWorldSearch size={20} />} className='custom-menu-item' />

                <div className='bottom-menu-items'>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <div className='avatar-container'>
                            <Badge count={1} status='success'>
                                <Avatar size={46} src={user?.avatar} />
                            </Badge>
                        </div>
                    </Dropdown>
                </div>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
