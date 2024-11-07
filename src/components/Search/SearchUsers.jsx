import { Input, Typography, Select, Checkbox } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import userApi from './../../apis/userApi';
import Loading from './../../components/Loading/Loading';
import useFetch from './../../hooks/useFetch';
import UserCard from '../../components/Search/UserCard';

const { Search } = Input;
const { Paragraph } = Typography;
const { Option } = Select;

const SearchUsers = () => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false });
    const [users, setUsers] = useState([]);
    const [searchMode, setSearchMode] = useState('name');
    const [onlyFriends, setOnlyFriends] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await fetchData(() => userApi.getAllUser());

            if (data.isOk) {
                setUsers(data.data);
            }
        })();
    }, [fetchData]);

    const handleSearchUsers = async (value) => {
        const data = await fetchData(() => userApi.searchUsers(value, 1, 10, searchMode, onlyFriends));

        if (data.isOk) {
            setUsers(data.data);
        }
    };

    const debouncedSearch = useCallback(debounce(handleSearchUsers, 300), [searchMode, onlyFriends]);

    return (
        <div className='bg-white rounded-lg p-6 shadow-md'>
            <Paragraph className='text-gray-600 mb-6'>
                Use the search box below to find users by their name or email. You can view their profiles and connect with them.
            </Paragraph>
            <div className='mb-6 flex items-center'>
                <Select
                    defaultValue='name'
                    onChange={(value) => setSearchMode(value)}
                    style={{ width: 150, marginRight: 10 }}
                >
                    <Option value='name'>Name</Option>
                    <Option value='email'>Email</Option>
                </Select>
                <Checkbox
                    onChange={(e) => setOnlyFriends(e.target.checked)}
                    style={{ marginRight: 10 }}
                >
                    Friends
                </Checkbox>
                <Search
                    placeholder={`Search user by ${searchMode}`}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    loading={isLoading}
                    className='flex-grow'
                    size='large'
                    enterButton
                />
            </div>
            <div className='flex flex-col gap-6' style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {isLoading ? <Loading /> : users.map((user) => <UserCard key={user._id} data={user} />)}
            </div>
        </div>
    );
};

export default SearchUsers;