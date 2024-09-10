import { Input, notification, Menu } from 'antd';
import { useEffect, useState } from 'react';
import UserCard from '../../components/Search/UserCard';
import userApi from './../../apis/userApi';
import Loading from './../../components/Loading/Loading';
import useFetch from './../../hooks/useFetch';
import Container from '../../components/Container';

const { Search } = Input;

const menuItems = [
    {
        key: 'Users',
        label: 'Users'
        // icon: <MailOutlined />
    },
    {
        key: 'Groups',
        label: 'Groups'
        // icon: <MailOutlined />
    }
];

const SearchPage = () => {
    const { fetchData, isLoading } = useFetch();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await fetchData(() => userApi.getAllUser());

            if (data.isOk) {
                setUsers(data.data);
                // notification.open({
                //     message: 'Users Loaded',
                //     description: 'The user data has been successfully loaded.'
                // });
            }
        })();
    }, []);

    return (
        <>
            <div className='flex'>
                <Menu items={menuItems} />
                <Container>
                    <Search placeholder='input search loading default' loading />
                    <div className='mt-5 flex flex-col gap-5'>
                        {isLoading ? <Loading /> : users.map((user) => <UserCard key={user._id} data={user} />)}
                    </div>
                </Container>
            </div>
        </>
    );
};

export default SearchPage;
