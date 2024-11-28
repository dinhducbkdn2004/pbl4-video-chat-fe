import { Input, Button, Select, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useFetch from '../../../hooks/useFetch';
import { authSelector } from '../../../redux/features/auth/authSelections';
import userApi from '../../../apis/userApi';
import Loading from '../../../components/Loading/Loading';
import UserCard from '../../../components/Search/UserCard';

const { Search } = Input;
const { Option } = Select;

const FriendListPage = () => {
    const [users, setUsers] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const { isLoading, fetchData } = useFetch({ showSuccess: false, showError: false });
    const { user } = useSelector(authSelector);

    useEffect(() => {
        if (user && user._id) {
            (async () => {
                const data = await fetchData(() => userApi.getFriendList(user._id));
                if (data.isOk) {
                    setUsers(() =>
                        data.data.map((user) => {
                            return {
                                ...user,
                                isFriend: true
                            };
                        })
                    );
                }
            })();
        }
    }, [user, fetchData]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (value) => {
        setSortOrder(value);
    };

    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const groupedUsers = sortedUsers.reduce((acc, user) => {
        const firstLetter = user.name[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(user);
        return acc;
    }, {});

    return (
        <>
            <div className='space-y-4 bg-white-dark px-4 py-4' style={{ height: '100vh' }}>
                <h1 className='m-0 text-sm font-semibold'>Bạn bè ({users.length})</h1>
                <div className='m-0 rounded-lg bg-white-default p-5' style={{ height: '100%' }}>
                    <div className='mb-4 flex items-center justify-between'>
                        <Search
                            placeholder='Tìm kiếm bạn bè'
                            allowClear
                            onChange={handleSearchChange}
                            className='w-full max-w-xs'
                        />

                        <Select defaultValue='asc' style={{ width: 120 }} onChange={handleSortChange}>
                            <Option value='asc'>Tên A-Z</Option>
                            <Option value='desc'>Tên Z-A</Option>
                        </Select>
                    </div>

                    <div className='flex flex-wrap gap-4'>
                        {isLoading ? (
                            <Loading />
                        ) : Object.keys(groupedUsers).length === 0 ? (
                            <Empty description='User not found' />
                        ) : (
                            Object.keys(groupedUsers).map((letter) => (
                                <div key={letter} className='w-full'>
                                    <h2 className='text-lg font-bold'>{letter}</h2>
                                    {groupedUsers[letter].map((user) => (
                                        <UserCard key={user._id} data={user} />
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FriendListPage;
