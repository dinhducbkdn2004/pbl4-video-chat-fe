import { Input, Typography, Skeleton, Empty, Row, Col, Card } from 'antd';
import { useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import userApi from './../../apis/userApi';
import useFetch from './../../hooks/useFetch';
import UserCard from '../../components/Search/UserCard';
import { authSelector } from '../../redux/features/auth/authSelections';

const { Search } = Input;
const { Paragraph } = Typography;

const SearchUsers = () => {
    const { user: currentUser } = useSelector(authSelector);
    const { fetchData, isLoading } = useFetch({ showSuccess: false, showError: false });
    const [users, setUsers] = useState([]);
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
        setIsSearching(true);
        try {
            const data = await fetchData(() => userApi.searchUsers(value));
            if (data.isOk) {
                setUsers(data.data);
            }
        } finally {
            setIsSearching(false);
        }
    };

    const debouncedSearch = useCallback(debounce(handleSearchUsers, 500), []);

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
        <Card className='rounded-lg shadow-sm dark:bg-black-light' bodyStyle={{ padding: isMobile ? '12px' : '24px' }}>
            <Paragraph className='text-gray-600 mb-3 text-sm dark:text-white-dark md:mb-4 md:text-base'>
                Use the search box below to find users. You can view their profiles and connect with them.
            </Paragraph>

            <div className='mb-3 md:mb-5'>
                <Search
                    placeholder='Search user'
                    onChange={(e) => debouncedSearch(e.target.value)}
                    loading={isLoading}
                    size={isMobile ? 'middle' : 'large'}
                    enterButton
                    className='w-full'
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
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Col key={index} {...getColSpans()}>
                                <Skeleton active avatar paragraph={{ rows: 2 }} />
                            </Col>
                        ))}
                    </Row>
                ) : users.length === 0 ? (
                    <Empty description='No users found' style={{ marginTop: isMobile ? '40px' : '80px' }} />
                ) : (
                    <Row gutter={[12, 12]}>
                        {users
                            .filter((user) => user._id !== currentUser._id)
                            .map((user) => (
                                <Col key={user._id} {...getColSpans()}>
                                    <UserCard data={user} />
                                </Col>
                            ))}
                    </Row>
                )}
            </div>
        </Card>
    );
};

export default SearchUsers;
