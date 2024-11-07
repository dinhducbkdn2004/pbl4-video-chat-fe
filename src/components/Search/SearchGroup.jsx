import { Input, Typography } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import userApi from './../../apis/userApi';
import Loading from './../../components/Loading/Loading';
import useFetch from './../../hooks/useFetch';

const { Search } = Input;
const { Paragraph } = Typography;

const SearchGroup = () => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false });
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        // (async () => {
        //     const data = await fetchData(() => userApi.searchGroups(''));
        //     if (data.isOk) {
        //         setGroups(data.data);
        //     }
        // })();
    }, [fetchData]);

    const handleSearchGroups = async (value) => {
        // const data = await fetchData(() => userApi.searchGroups(value, 1, 10)); //chua co api searchGroups
        // if (data.isOk) {
        //     setGroups(data.data);
        // }
    };

    const debouncedSearch = useCallback(debounce(handleSearchGroups, 300), []);

    return (
        <div className='bg-white rounded-lg p-6 shadow-md'>
            <Paragraph className='text-gray-600 mb-6'>
                Use the search box below to find groups by their name. You can view their profiles and join them.
            </Paragraph>
            <Search
                placeholder='Search group by name'
                onChange={(e) => debouncedSearch(e.target.value)}
                loading={isLoading}
                className='mb-6'
                size='large'
                enterButton
            />

            <div className='flex flex-col gap-6' style={{ height: 'calc(100vh - 200px)' }}>
                {/* {isLoading ? <Loading /> : groups.map((group) => <GroupCard key={group._id} data={group} />)} */}
            </div>
        </div>
    );
};

export default SearchGroup;
