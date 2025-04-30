import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import notificationApi from '../../apis/notificationApi';
import { Button, List, Typography, Layout, Avatar, Tabs, Dropdown, Menu, Spin } from 'antd';
import { CloseOutlined, EllipsisOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Content } = Layout;
const { Text } = Typography;
const { TabPane } = Tabs;

const SidebarContainer = styled.div`
    padding: 10px;
    width: 385px;
    background: #fff;
    position: fixed;
    ${window.innerWidth <= 768 ? 'left: 90px;' : 'left: 100px'};
    top: 1;
    z-index: 1000;
    border-radius: 7px;
`;

const Header = styled.div`
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
`;

const StyledButton = styled(Button)`
    &:hover {
        color: #1890ff;
    }
`;

const ContentWrapper = styled(Content)`
    padding: 1px 24px;
    overflow-y: auto;
    height: calc(100vh - 120px);
`;

const NotificationSidebar = ({ onClose, markAllAsRead }) => {
    const sidebarRef = useRef();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState('1');
    const observer = useRef();

    const fetchNotifications = async (tab, page) => {
        setLoading(true);
        const response = await notificationApi.getAll(page);
        setNotifications((prevNotifications) => [...prevNotifications, ...response.data]);
        setHasMore(response.data.length > 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchNotifications(activeTab, page);
    }, [activeTab, page]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest('.ant-dropdown')
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleMenuClick = async (key, notification) => {
        if (key === 'markAsRead') {
            await notificationApi.updatedNotification(notification._id, true);
            setNotifications((prevNotifications) =>
                prevNotifications.map((item) => (item._id === notification._id ? { ...item, isRead: true } : item))
            );
        } else if (key === 'markAsUnread') {
            await notificationApi.updatedNotification(notification._id, false);
            setNotifications((prevNotifications) =>
                prevNotifications.map((item) => (item._id === notification._id ? { ...item, isRead: false } : item))
            );
        } else if (key === 'delete') {
            await notificationApi.deleteNotification(notification._id);
            setNotifications((prevNotifications) => prevNotifications.filter((item) => item._id !== notification._id));
        }
    };

    const renderNotificationItem = (item) => {
        const menu = (
            <Menu onClick={({ key }) => handleMenuClick(key, item)}>
                {item.isRead ? (
                    <Menu.Item key='markAsUnread'>Mark as Unread</Menu.Item>
                ) : (
                    <Menu.Item key='markAsRead'>Mark as Read</Menu.Item>
                )}
                <Menu.Item key='delete'>Delete</Menu.Item>
            </Menu>
        );

        let avatarSrc = item.avatar;
        let link = `/message/${item.detail}`;
        let avatarElement = <Avatar src={avatarSrc} />;

        if (item.type === 'ChatRooms' && item.detail) {
            avatarSrc = item.detail.chatRoomImage;
            link = `/message/${item.detail._id}`;
            avatarElement = <Avatar src={avatarSrc} />;
        } else if (item.type === 'FriendRequests') {
            if (item.detail) {
                avatarSrc = item.detail.sender.avatar;
                link = `/user/${item.detail.sender._id}`;
                avatarElement = <Avatar src={avatarSrc} />;
            }
        }

        return (
            <List.Item
                actions={[
                    <Dropdown key={item._id} overlay={menu} trigger={['click']}>
                        <Button shape='circle' size='small' icon={<EllipsisOutlined />} />
                    </Dropdown>
                ]}
            >
                <List.Item.Meta
                    className='hover: cursor-pointer bg-white-default dark:bg-black-light'
                    avatar={avatarElement}
                    title={<a href={link}>{item.message}</a>}
                    description={moment(item.createdAt).fromNow()}
                />
            </List.Item>
        );
    };

    const markAllAsReadHandler = async () => {
        await notificationApi.seenNotification();
        setNotifications((prevNotifications) => prevNotifications.map((item) => ({ ...item, isRead: true })));
        markAllAsRead();
    };

    const readNotifications = notifications.filter((item) => item.isRead);
    const unreadNotifications = notifications.filter((item) => !item.isRead);

    const lastNotificationElementRef = useRef();
    useEffect(() => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });
        if (lastNotificationElementRef.current) {
            observer.current.observe(lastNotificationElementRef.current);
        }
    }, [loading, hasMore]);

    const handleTabChange = (key) => {
        setActiveTab(key);
        setPage(1);
        setNotifications([]);
    };

    return (
        <SidebarContainer
            className='mt-4 bg-white-default shadow-lg dark:bg-black-light dark:text-white-default'
            ref={sidebarRef}
        >
            <Header className='dark:border-gray'>
                <Text
                    className='text-blue'
                    style={{
                        fontSize: '22px',
                        fontWeight: 'bold'
                    }}
                >
                    Notifications
                </Text>
                <StyledButton type='text' icon={<CloseOutlined />} onClick={onClose} />
            </Header>
            <ContentWrapper>
                <Tabs
                    defaultActiveKey='1'
                    onChange={handleTabChange}
                    tabBarExtraContent={{ right: <Button onClick={markAllAsReadHandler}>Mark All as Read</Button> }}
                >
                    <TabPane tab='Unread' key='1'>
                        <List
                            itemLayout='horizontal'
                            dataSource={unreadNotifications}
                            renderItem={(item, index) => (
                                <div ref={index === unreadNotifications.length - 1 ? lastNotificationElementRef : null}>
                                    {renderNotificationItem(item)}
                                </div>
                            )}
                        />
                        {loading && (
                            <div style={{ textAlign: 'center', marginTop: 12 }}>
                                <Spin />
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab='Read' key='2'>
                        <List
                            itemLayout='horizontal'
                            dataSource={readNotifications}
                            renderItem={(item, index) => (
                                <div ref={index === readNotifications.length - 1 ? lastNotificationElementRef : null}>
                                    {renderNotificationItem(item)}
                                </div>
                            )}
                        />
                        {loading && (
                            <div style={{ textAlign: 'center', marginTop: 12 }}>
                                <Spin />
                            </div>
                        )}
                    </TabPane>
                </Tabs>
            </ContentWrapper>
        </SidebarContainer>
    );
};

export default NotificationSidebar;
