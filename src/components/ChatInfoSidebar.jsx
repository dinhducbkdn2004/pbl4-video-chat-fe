import { useState } from 'react';
import { Avatar, Button, Drawer, Tooltip, Menu } from 'antd';
import {
    BellOutlined,
    InboxOutlined,
    SearchOutlined,
    AppstoreOutlined,
    MailOutlined,
    EllipsisOutlined,
    LogoutOutlined,
    UserAddOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

const ChatInfoSidebar = ({ open, onClose }) => {
    const location = useLocation();
    const { name: roomName, participants: members, typeRoom, chatRoomImage } = location.state;
    console.log(members);
    const items = [
        {
            key: '1',
            icon: <MailOutlined />,
            label: 'Tuỳ chỉnh đoạn chat',
            children: [
                { key: '1-1', label: 'Đổi tên đoạn chat' },
                { key: '1-2', label: 'Thay đổi ảnh' }
            ]
        },
        {
            key: '2',
            icon: <AppstoreOutlined />,
            label: 'Thành viên trong đoạn chat',
            children: members?.map((member, index) => ({
                key: `2-${index + 1}`,
                label: (
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <Avatar src={member.avatar} size='small' className='mr-2' />
                            {member.name}
                        </div>
                        <Button type='text' icon={<EllipsisOutlined />} />
                    </div>
                )
            }))
        },
        {
            key: '3',
            icon: <InboxOutlined />,
            label: 'File phương tiện, file và liên kết',
            children: [
                { key: '3-1', label: 'File phương tiện' },
                { key: '3-2', label: 'File' },
                { key: '3-3', label: 'Liên kết' }
            ]
        },
        ...(typeRoom === 'Group'
            ? [
                  {
                      key: '4',
                      icon: <LogoutOutlined className='mr-2' />,
                      label: 'Rời nhóm'
                  },
                  {
                      key: '5',
                      icon: <UserAddOutlined className='mr-2' />,
                      label: 'Yêu cầu vào nhóm'
                  }
              ]
            : [])
    ];

    const getLevelKeys = (items) => {
        const key = {};
        const func = (items, level = 1) => {
            items.forEach((item) => {
                if (item.key) {
                    key[item.key] = level;
                }
                if (item.children) {
                    func(item.children, level + 1);
                }
            });
        };
        func(items);
        return key;
    };

    const levelKeys = getLevelKeys(items);
    const [stateOpenKeys, setStateOpenKeys] = useState(['1']);
    const [drawerTitle, setDrawerTitle] = useState('Chat Room Detail');
    const [isFileView, setIsFileView] = useState(false);
    const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);

    const onOpenChange = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys
                    .filter((_, index) => index !== repeatIndex)
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
            );
            if (currentOpenKey === '3') {
                setDrawerTitle('File phương tiện, file và liên kết');
                setIsFileView(true);
                setIsBackButtonVisible(true);
            } else {
                setDrawerTitle('Chat Room Detail');
                setIsFileView(false);
                setIsBackButtonVisible(false);
            }
        } else {
            setStateOpenKeys(openKeys);
        }
    };

    const handleBack = () => {
        setDrawerTitle('Chat Room Detail');
        setIsFileView(false);
        setStateOpenKeys(['1']);
        setIsBackButtonVisible(false);
    };

    return (
        <Drawer
            title={
                isBackButtonVisible ? (
                    <div className='flex items-center'>
                        <ArrowLeftOutlined onClick={handleBack} className='mr-2' />
                        {drawerTitle}
                    </div>
                ) : (
                    drawerTitle
                )
            }
            placement='right'
            onClose={onClose}
            open={open}
            width={400}
            closable={!isBackButtonVisible}
        >
            {isFileView ? (
                <div className='flex justify-around items-center'>
                    <Menu
                        mode='horizontal'
                        defaultSelectedKeys={['3-1']}
                        openKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                        style={{ width: '100%' }}
                        items={items.find((item) => item.key === '3').children}
                    />
                </div>
            ) : (
                <div className='flex flex-col items-center'>
                    <Avatar.Group size='large' max={{ count: 2 }}>
                        {members?.map((member, index) => (
                            <Tooltip key={index} title={member.name}>
                                <Avatar src={member.avatar} />
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                    <h3 className='mt-3'>{roomName}</h3>
                    <div className='mt-2 flex'>
                        <Button icon={<BellOutlined />} className='mb-2 mr-2'>
                            Tắt thông báo
                        </Button>
                        <Button icon={<SearchOutlined />}>Tìm kiếm</Button>
                    </div>
                    <Menu
                        mode='inline'
                        defaultSelectedKeys={['1-1']}
                        openKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                        style={{ width: '100%' }}
                        items={items}
                    />
                </div>
            )}
        </Drawer>
    );
};

export default ChatInfoSidebar;