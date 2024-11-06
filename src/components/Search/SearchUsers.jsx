import { Input, Typography } from 'antd';
import { useEffect, useState } from 'react';
import userApi from './../../apis/userApi';
import Loading from './../../components/Loading/Loading';
import useFetch from './../../hooks/useFetch';
import UserCard from '../../components/Search/UserCard';

const { Search } = Input;
const { Title, Paragraph } = Typography;

const SearchUsers = () => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await fetchData(() => userApi.getAllUser());

            if (data.isOk) {
                setUsers(data.data);
            }
        })();
    }, [fetchData]);

    const handleSearchUsers = async (value) => {
        const data = await fetchData(() => userApi.searchUsers(value, 1, 10));

        if (data.isOk) {
            setUsers(data.data);
        }
    };

    return (
        <div className='p-6 bg-white rounded-lg shadow-md'>
            <Title level={2} className='mb-4'>Search Users</Title>
            <Paragraph className='mb-6 text-gray-600'>
                Use the search box below to find users by their name. You can view their profiles and connect with them.
            </Paragraph>
            <Search
                placeholder='Search user by name'
                onSearch={handleSearchUsers}
                loading={isLoading}
                className='mb-6'
                size='large'
                enterButton
            />
            <div className='flex flex-col gap-6'>
                {isLoading ? <Loading /> : users.map((user) => <UserCard key={user._id} data={user} />)}
            </div>
        </div>
    );
};

export default SearchUsers;