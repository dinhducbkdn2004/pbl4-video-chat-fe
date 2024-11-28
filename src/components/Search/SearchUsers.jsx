import { Input, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import userApi from './../../apis/userApi';
import Loading from './../../components/Loading/Loading';
import useFetch from './../../hooks/useFetch';
import UserCard from '../../components/Search/UserCard';
import { authSelector } from '../../redux/features/auth/authSelections';

const { Search } = Input;
const { Paragraph } = Typography;

const SearchUsers = () => {
    const { user: currentUser } = useSelector(authSelector);
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (currentUser && currentUser._id) {
            const fetchUsers = async () => {
                const usersData = await fetchData(() => userApi.getAllUser());

                if (usersData.isOk) {
                    setUsers(usersData.data);
                }
            };

            fetchUsers();
        }
    }, [fetchData, currentUser]);

    const handleSearchUsers = async (value) => {
        const data = await fetchData(() => userApi.searchUsers(value, 1, 10));

        if (data.isOk) {
            setUsers(data.data);
        }
    };

    const debouncedSearch = useCallback(debounce(handleSearchUsers, 300), []);

    return (
        <div className='bg-white rounded-lg p-6 shadow-md'>
            <Paragraph className='text-gray-600 mb-6'>
                Use the search box below to find users. You can view their profiles and connect with them.
            </Paragraph>
            <div className='mb-6 flex items-center'>
                <Search
                    placeholder='Search user'
                    onChange={(e) => debouncedSearch(e.target.value)}
                    loading={isLoading}
                    className='flex-grow'
                    size='large'
                    enterButton
                />
            </div>
            <div className='flex flex-col gap-6' style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {isLoading ? <Loading /> : users.filter(user => user._id !== currentUser._id).map((user) => <UserCard key={user._id} data={user} />)}
            </div>
        </div>
    );
};

export default SearchUsers;