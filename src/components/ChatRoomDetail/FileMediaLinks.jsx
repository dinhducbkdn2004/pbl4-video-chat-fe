import { useState, useEffect } from 'react';
import { Menu, List, Typography } from 'antd';
import RoomChatApi from '../../apis/RoomChatApi';
import useFetch from '../../hooks/useFetch';

const FileMediaLinks = ({ stateOpenKeys, onOpenChange, items, chatRoomId }) => {
    const fileMediaItems = items.find((item) => item.key === '3').children;
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
        console.log('data', data);
        console.log('content', content);
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
                return <img src={item.fileUrl} alt='media' style={{ width: '100%' }} />;

            case 'Document':
                return (
                    <a href={item && item.fileUrl} target='_blank' rel='noreferrer'>
                        {item.name}
                    </a>
                );
            case 'Link':
                return (
                    <a href={item && item.content} target='_blank' rel='noreferrer'>
                        {item.content}
                    </a>
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
                <List
                    bordered
                    dataSource={content}
                    renderItem={(item) => <List.Item>{renderMediaItem(item)}</List.Item>}
                />
            </div>
        </div>
    );
};

export default FileMediaLinks;
