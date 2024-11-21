import { Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, TeamOutlined, UserAddOutlined, GroupOutlined } from '@ant-design/icons';

const menuItems = [
    {
        key: 'friend-list',
        label: 'Danh sách bạn bè',
        icon: <UserOutlined className='mr-2' />
    },
    {
        key: 'groups-list',
        label: 'Danh sách cộng đồng',
        icon: <TeamOutlined className='mr-2' />
    },
    {
        key: 'friend-request',
        label: 'Lời mời kết bạn',
        icon: <UserAddOutlined className='mr-2' />
    },
    {
        key: 'group-request',
        label: 'Lời mời vào cộng đồng',
        icon: <GroupOutlined className='mr-2' />
    }
];

const ContactPage = () => {
    const navigate = useNavigate();
    const currentItem = menuItems.find((item) => item.key === window.location.pathname.split('/').pop());

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '20rem',
                    backgroundColor: 'white',
                    borderRight: '1px solid #e0e0e0',
                    height: '100vh',
                    overflow: 'auto'
                }}
            >
                <div
                    className='flex h-[73px] items-center justify-between border-b border-[#e0e0e0] bg-white-default p-4'
                    style={{ position: 'sticky', top: 0, zIndex: 10, height: '73px', padding: '18px 24px' }}
                >
                    <h2 className='text-blue' style={{ fontSize: '21px', fontWeight: 750 }}>
                        Contacts
                    </h2>
                </div>
                <Menu
                    items={menuItems}
                    onClick={(e) => navigate(`/contact/${e.key}`)}
                    style={{
                        backgroundColor: 'white',
                        overflow: 'auto'
                    }}
                />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                    className='flex h-[73px] items-center justify-between border-b border-[#e0e0e0] bg-white-default p-4'
                    style={{ position: 'sticky', top: 0, zIndex: 10, height: '73px' }}
                >
                    <h2 className='text-lg font-bold'>
                        {currentItem?.icon} {currentItem?.label}
                    </h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
