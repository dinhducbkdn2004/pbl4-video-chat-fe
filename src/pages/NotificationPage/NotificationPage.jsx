import moment from 'moment';
import { useState } from 'react';
import { Button, List, Typography, Badge, Pagination, Layout, Select, Space, Row, Col } from 'antd';
import { NotificationOutlined, BellOutlined, UserAddOutlined, FilterOutlined } from '@ant-design/icons';
import { useSocket } from '../../hooks/useSocket';
import Container from '../../components/Container';
import assets from '../../assets/index.js';

const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const NotificationPage = () => {
    const { notifications, markAllAsRead } = useSocket();
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('ALL');
    const notificationsPerPage = 4;

    const filteredNotifications = notifications.filter((notification) => {
        if (filter === 'ALL') return true;
        if (filter === 'READ') return notification.isRead;
        if (filter === 'UNREAD') return !notification.isRead;
        return notification.type === filter;
    });

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = filteredNotifications.slice(indexOfFirstNotification, indexOfLastNotification);

    const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'MESSAGE':
                return <NotificationOutlined style={{ color: '#1890ff' }} />;
            case 'FRIEND_REQUEST':
                return <UserAddOutlined style={{ color: '#52c41a' }} />;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <Content
                style={{
                    height: '100vh',
                    overflowY: 'auto',
                    backgroundImage: `url(${assets.chatpage_1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <Container>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <BellOutlined style={{ fontSize: '32px', marginRight: '8px', color: '#1890ff' }} />
                        <Typography.Title level={2} style={{ margin: 0 }}>
                            Notification
                        </Typography.Title>
                    </div>
                    <Text className='mb-2' type='secondary' style={{ display: 'block', marginBottom: '24px' }}>
                        Stay updated with the latest notifications
                    </Text>
                    <Row gutter={[16, 16]} style={{ marginBottom: '17px' }}>
                        <Col span={18}>
                            <Row align="middle">
                                <FilterOutlined style={{ marginRight: '8px' }} />
                                <Text style={{ marginRight: '8px' }}>Sort by:</Text>
                                <Select
                                    value={filter}
                                    onChange={(value) => setFilter(value)}
                                    style={{ width: '200px' }}
                                >
                                    <Option value='ALL'>All</Option>
                                    <Option value='MESSAGE'>Message</Option>
                                    <Option value='FRIEND_REQUEST'>Friend Request</Option>
                                    <Option value='READ'>Read</Option>
                                    <Option value='UNREAD'>Unread</Option>
                                </Select>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <Button  type='primary' onClick={markAllAsRead} style={{ width: '100%'}}>
                                Mark All as Read
                            </Button>
                        </Col>
                    </Row>
                    <List
                        itemLayout='horizontal'
                        dataSource={currentNotifications}
                        renderItem={(notification) => (
                            <List.Item
                                key={notification._id}
                                style={{
                                    cursor: 'pointer',
                                    background: notification.isRead ? '#f6f6f6' : '#fff',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                                    marginBottom: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderLeft: `4px solid ${notification.isRead ? '#52c41a' : '#ff4d4f'}`
                                }}
                            >
                                <Space style={{ marginRight: '16px' }}>{getIcon(notification.type)}</Space>
                                <List.Item.Meta
                                    title={<Text strong>{notification.message}</Text>}
                                    description={moment(notification.createdAt).format('DD/MM/YYYY HH:mm')}
                                />
                                <Badge
                                    status={notification.isRead ? 'success' : 'error'}
                                    text={notification.isRead ? 'Read' : 'Unread'}
                                />
                            </List.Item>
                        )}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <Pagination
                            current={currentPage}
                            total={filteredNotifications.length}
                            pageSize={notificationsPerPage}
                            onChange={handlePageChange}
                        />
                    </div>
                </Container>
            </Content>
        </Layout>
    );
};

export default NotificationPage;