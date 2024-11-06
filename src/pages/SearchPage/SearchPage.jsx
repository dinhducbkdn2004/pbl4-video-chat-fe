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
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Menu
                items={menuItems}
                onClick={(e) => navigate(`/search/${e.key}`)}
                style={{
                    backgroundColor: 'white',
                    width: '20rem',
                    borderRadius: '0.375rem',
                    borderRight: '1px solid #e0e0e0',
                    height: '100vh',
                    overflow: 'auto'
                }}
                defaultSelectedKeys={['users']}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
