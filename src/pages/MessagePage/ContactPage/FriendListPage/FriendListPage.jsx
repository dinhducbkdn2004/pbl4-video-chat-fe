import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import userApi from '../../../../apis/userApi';
import Loading from '../../../../components/Loading/Loading';
import useFetch from '../../../../hooks/useFetch';
import { authSelector } from '../../../../redux/features/auth/authSelections';
import UserCard from '../../../../components/Search/UserCard';
const { Search } = Input;

const FriendListPage = () => {
    const onSearch = (value) => console.log(value);
    const [users, setUsers] = useState([]);
    const { isLoading, fetchData } = useFetch({ showSuccess: false });
    const { user } = useSelector(authSelector);

    useEffect(() => {
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
    }, [user._id]);

    return (
        <>
            <div className='rounded-md bg-white-default px-4 py-5 shadow-md'>
                <h1 className='w-full text-2xl font-semibold'>Danh sách bạn bè</h1>
            </div>
            <div className='space-y-6 px-4 py-5'>
                <h1 className='text-xl font-semibold'>Bạn bè ({users.length})</h1>
                <Search placeholder='Tìm kiếm bạn bè' allowClear onSearch={onSearch} className='w-full max-w-xs' />
                <div className='flex flex-wrap gap-4'>
                    {isLoading ? <Loading /> : users.map((user) => <UserCard key={user._id} data={user} />)}
                </div>
            </div>
        </>
    );
};

export default FriendListPage;
