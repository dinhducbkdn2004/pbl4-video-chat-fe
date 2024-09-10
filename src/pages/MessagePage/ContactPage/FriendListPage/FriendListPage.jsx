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
            <div className='bg-white-default px-4 py-5'>
                <h1 className='w-full'>Danh sách bạn bè</h1>
            </div>
            <div className='px-4 py-5'>
                <h1>Bạn bè ({users.length})</h1>
                <Search
                    placeholder='input search text'
                    allowClear
                    onSearch={onSearch}
                    style={{
                        width: 200
                    }}
                />
                <div>{isLoading ? <Loading /> : users.map((user) => <UserCard key={user._id} data={user} />)}</div>
            </div>
        </>
    );
};

export default FriendListPage;
