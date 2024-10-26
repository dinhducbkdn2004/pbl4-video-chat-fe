import { useState, useEffect } from 'react';
import { Menu, List, Typography, Row, Col, Image, Card, Avatar } from 'antd';
import { FileImageOutlined, FileTextOutlined, LinkOutlined } from '@ant-design/icons';
import RoomChatApi from '../../apis/RoomChatApi';
import useFetch from '../../hooks/useFetch';

const FileMediaLinks = ({ stateOpenKeys, onOpenChange, items, chatRoomId }) => {
    const fileMediaItems = items
        .find((item) => item.key === '3')
        .children.map((item) => {
            switch (item.key) {
                case '3-1':
                    return { ...item, icon: <FileImageOutlined className='mr-1' /> };
                case '3-2':
                    return { ...item, icon: <FileTextOutlined className='mr-1' /> };
                case '3-3':
                    return { ...item, icon: <LinkOutlined className='mr-1' /> };
                default:
                    return item;
            }
        });

    const { fetchData } = useFetch({ showSuccess: false, showError: false });
    const [content, setContent] = useState([]);
    const [selectedType, setSelectedType] = useState('Media');

    useEffect(() => {
        getFileMediaLinks(selectedType);
    }, [selectedType]);

    const getFileMediaLinks = async (type) => {
        const response = await fetchData(() => RoomChatApi.getFileMediaLinks(chatRoomId, type));
        const data = response.data || [];
        setContent(Array.isArray(data) ? data : []);
    };

    const handleMenuClick = (e) => {
        const key = e.key;
        let type;
        switch (key) {
            case '3-1':
                type = 'Media';
                break;
            case '3-2':
                type = 'Document';
                break;
            case '3-3':
                type = 'Link';
                break;
            default:
                type = '';
        }
        setSelectedType(type);
    };

    const renderMediaItem = (item) => {
        switch (item.type) {
            case 'Video':
                return (
                    <video width='100%' controls>
                        <source src={item.fileUrl} type='video/mp4' />
                        Your browser does not support the video tag.
                    </video>
                );
            case 'Picture':
                return <Image src={item.fileUrl} alt='media' style={{ width: '100%' }} />;
            case 'Document':
                return (
                    <Card hoverable className='h-25 w-full'>
                        <Card.Meta
                            avatar={
                                <div className='flex items-center justify-center rounded-lg border border-white-dark bg-white-dark p-3'>
                                    <FileTextOutlined />
                                </div>
                            }
                            title={
                                <a href={item && item.fileUrl} target='_blank' rel='noreferrer'>
                                    {item.content}
                                </a>
                            }
                            description={
                                <>
                                    <div className='text-sm'>{new Date(item.createdAt).toLocaleString()}</div>
                                </>
                            }
                        />
                    </Card>
                );
            case 'Link':
                return (
                    <Card hoverable className='h-25 w-full'>
                        <Card.Meta
                            avatar={
                                <Avatar
                                    className='flex items-center justify-center'
                                    src={`https://www.google.com/s2/favicons?domain=${item.content}`}
                                />
                            }
                            title={
                                <a href={item && item.content} target='_blank' rel='noreferrer'>
                                    {item.content}
                                </a>
                            }
                            description={
                                <>
                                    <div className='text-sm'>{new Date(item.createdAt).toLocaleString()}</div>
                                </>
                            }
                        />
                    </Card>
                );
            default:
                return <Typography.Text>{item.name}</Typography.Text>;
        }
    };
    return (
        <div className='flex flex-col items-center justify-around'>
            <Menu
                mode='horizontal'
                defaultSelectedKeys={['3-1']}
                openKeys={stateOpenKeys}
                onOpenChange={onOpenChange}
                style={{ width: '100%' }}
                items={fileMediaItems}
                onClick={handleMenuClick}
            />
            <div className='mt-4 w-full'>
                {selectedType === 'Media' ? (
                    <Row gutter={[16, 16]}>
                        {content.map((item, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={8}>
                                {renderMediaItem(item)}
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <List
                        dataSource={content}
                        renderItem={(item) => <List.Item key={item.id}>{renderMediaItem(item)}</List.Item>}
                    />
                )}
            </div>
        </div>
    );
};

export default FileMediaLinks;
