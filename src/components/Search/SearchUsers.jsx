import { Input } from 'antd';
import { useEffect, useState } from 'react';

import Container from '../../components/Container';
import UserCard from '../../components/Search/UserCard';
import userApi from './../../apis/userApi';
import Loading from './../../components/Loading/Loading';
import useFetch from './../../hooks/useFetch';

const { Search } = Input;
const SearchUsers = () => {
    const { fetchData, isLoading } = useFetch();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        (async () => {
            const data = await fetchData(() => userApi.getAllUser());

            if (data.isOk) {
                setUsers(data.data);
            }
        })();
    }, []);

    const handleSearchUsers = async (value) => {
        const data = await fetchData(() => userApi.searchUsers(value, 1, 10));

        if (data.isOk) {
            setUsers(data.data);
        }
    };
    return (
        <Container>
            <Search placeholder='Search user by name' onSearch={handleSearchUsers} loading={isLoading} />
            <div className='mt-5 flex flex-col gap-5'>
                {isLoading ? <Loading /> : users.map((user) => <UserCard key={user._id} data={user} />)}
            </div>
        </Container>
    );
};

export default SearchUsers;
