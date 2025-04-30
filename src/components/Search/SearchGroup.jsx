import { Input, Typography, Row, Col, Skeleton, Empty, Card } from 'antd';
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
    const [isMobile, setIsMobile] = useState(false);
    const [screenSize, setScreenSize] = useState('md');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);

            if (width < 576) {
                setScreenSize('xs');
            } else if (width < 768) {
                setScreenSize('sm');
            } else if (width < 992) {
                setScreenSize('md');
            } else if (width < 1200) {
                setScreenSize('lg');
            } else {
                setScreenSize('xl');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
        try {
            const data = await fetchData(() => RoomChatApi.searchChatroomByName(false, value, 1, 10));
            if (data.isOk) {
                const groupRooms = data.data.filter((room) => room.typeRoom === 'Group');
                setGroups(groupRooms);
            }
        } finally {
            setIsSearching(false);
        }
    };

    const debouncedSearch = useCallback(debounce(handleSearchGroups, 500), [handleSearchGroups]);

    // Determine column spans based on screen size
    const getColSpans = () => {
        switch (screenSize) {
            case 'xs':
                return { xs: 24 };
            case 'sm':
                return { xs: 24, sm: 12 };
            case 'md':
                return { xs: 24, sm: 12, md: 8 };
            case 'lg':
                return { xs: 24, sm: 12, md: 8, lg: 6 };
            case 'xl':
            default:
                return { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
        }
    };

    // Calculate dynamic content height based on screen size
    const getContentHeight = () => {
        const baseHeight = isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 220px)';
        return baseHeight;
    };

    return (
        <Card
            className='bg-white rounded-lg shadow-sm dark:bg-black-light'
            bodyStyle={{ padding: isMobile ? '12px' : '24px' }}
        >
            <Paragraph className='text-gray-600 mb-3 text-sm dark:text-white-dark md:mb-4 md:text-base'>
                Use the search box below to find groups by their name. You can view their profiles and join them.
            </Paragraph>

            <div className='mb-3 md:mb-5'>
                <Search
                    placeholder='Search groups'
                    onChange={(e) => debouncedSearch(e.target.value)}
                    loading={isLoading}
                    size={isMobile ? 'middle' : 'large'}
                    enterButton
                    className='w-full dark:bg-black-light'
                />
            </div>

            <div
                className='overflow-y-auto'
                style={{
                    height: getContentHeight(),
                    paddingBottom: isMobile ? '60px' : '0',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d1d5db transparent'
                }}
            >
                {isLoading || isSearching ? (
                    <Row gutter={[12, 12]}>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Col key={index} {...getColSpans()}>
                                <Skeleton active avatar paragraph={{ rows: 2 }} />
                            </Col>
                        ))}
                    </Row>
                ) : groups.length === 0 ? (
                    <Empty description='No groups found' style={{ marginTop: isMobile ? '40px' : '80px' }} />
                ) : (
                    <Row gutter={[12, 12]}>
                        {groups.map((group) => (
                            <Col key={group._id} {...getColSpans()}>
                                <GroupCard data={group} isMember={false} />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </Card>
    );
};

export default SearchGroup;
