import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
const menuItems = [
    {
        key: 'users',
        label: 'Users'
        // icon: <MailOutlined />
    },
    {
        key: 'groups',
        label: 'Groups'
        // icon: <MailOutlined />
    }
];
const SearchSideBar = () => {
    const navigate = useNavigate();
    return (
        <>
            <Menu className='h-svh' items={menuItems} onClick={(e) => navigate(`/search/${e.key}`)} />
        </>
    );
};

export default SearchSideBar;
