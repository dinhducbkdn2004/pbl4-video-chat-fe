import { Input, Typography, Row, Col, Skeleton, Empty } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import useFetch from './../../hooks/useFetch';
import GroupCard from './GroupCard';
import RoomChatApi from '../../apis/RoomChatApi';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';

const { Search } = Input;
const { Paragraph } = Typography;

const SearchGroup = () => {
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const { user: currentUser } = useSelector(authSelector);
    const [groups, setGroups] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        (async () => {
            const data = await fetchData(() => RoomChatApi.getGroup('PUBLIC', 'Group', 1, 10, false));
            if (data.isOk) {
                const groupRooms = data.data.filter((room) => room.typeRoom === 'Group');
                setGroups(groupRooms);
            }
        })();
    }, [fetchData]);

    const handleSearchGroups = async (value) => {
        setIsSearching(true);
        const data = await fetchData(() => RoomChatApi.getGroup('PUBLIC', 'Group', 1, 10, false));
        setIsSearching(false);

        if (data.isOk) {
            const groupRooms = data.data.filter(
                (room) => room.typeRoom === 'Group' && room.name.toLowerCase().includes(value.toLowerCase())
            );
            setGroups(groupRooms);
        }
    };

    const debouncedSearch = useCallback(debounce(handleSearchGroups, 300), []);

    return (
        <div className='bg-white rounded-lg bg-white-default p-6 dark:bg-black-light'>
            <Paragraph className='text-gray-600 mb-6 dark:text-white-dark'>
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

            <div className='flex flex-col gap-6 overflow-y-auto' style={{ height: 'calc(100vh - 200px)' }}>
                {isLoading || isSearching ? (
                    <Row gutter={[16, 16]}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Col key={index} xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Skeleton active avatar paragraph={{ rows: 2 }} />
                            </Col>
                        ))}
                    </Row>
                ) : groups.length === 0 ? (
                    <Empty description='No groups found' />
                ) : (
                    <Row gutter={[16, 16]}>
                        {groups.map((group) => {
                            const isMember = group.participants.some(
                                (participant) => participant._id === currentUser._id
                            );
                            return (
                                <Col key={group._id} xs={24} sm={12} md={12} lg={12} xl={12}>
                                    <GroupCard data={group} isMember={isMember} />
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </div>
        </div>
    );
};

export default SearchGroup;
