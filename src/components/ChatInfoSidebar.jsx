import { useState } from 'react';
import { Avatar, Button, Drawer, Menu } from 'antd';
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
import { useLocation, useParams } from 'react-router-dom';
import ChangeDetails from '../components/ChatRoomDetail/ChangeDetails';
import FileMediaLinks from '../components/ChatRoomDetail/FileMediaLinks';

const ChatInfoSidebar = ({ open, onClose }) => {
    const location = useLocation();
    const { chatRoomId: currentChatRoomId } = useParams();
    const { name: roomName, participants: members, typeRoom, chatRoomImage, admins, moderators } = location.state;

    const [isChangeDetailsVisible, setIsChangeDetailsVisible] = useState(false);
    const [changeDetailsType, setChangeDetailsType] = useState('');
    const [stateOpenKeys, setStateOpenKeys] = useState(['1']);
    const [drawerTitle, setDrawerTitle] = useState('Chat Room Detail');
    const [isFileView, setIsFileView] = useState(false);
    const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);

    const getRole = (memberId) => {
        if (admins.some((admin) => admin._id === memberId)) return 'Admin';
        if (moderators.some((moderator) => moderator._id === memberId)) return 'Moderator';
        return 'Member';
    };

    const createMemberItems = (role) =>
        members
            .filter((member) => getRole(member._id) === role)
            .map((member, index) => ({
                key: `${role}-${index + 1}`,
                label: (
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <Avatar src={member.avatar} size='small' className='mr-2' />
                            {member.name}
                        </div>
                        <Button type='text' icon={<EllipsisOutlined />} />
                    </div>
                )
            }));

    const items = [
        {
            key: '1',
            icon: <MailOutlined />,
            label: 'Tuỳ chỉnh đoạn chat',
            children: [
                { key: '1-1', label: 'Đổi tên đoạn chat', onClick: () => handleChangeDetails('name') },
                ...(typeRoom === 'Group'
                    ? [{ key: '1-2', label: 'Thay đổi ảnh', onClick: () => handleChangeDetails('image') }]
                    : [])
            ]
        },
        ...(typeRoom === 'Group'
            ? [
                  {
                      key: '2',
                      icon: <AppstoreOutlined />,
                      label: 'Thành viên trong đoạn chat',
                      children: [
                          { key: '2-1', label: 'Admin', children: createMemberItems('Admin') },
                          { key: '2-2', label: 'Moderator', children: createMemberItems('Moderator') },
                          { key: '2-3', label: 'Member', children: createMemberItems('Member') }
                      ]
                  }
              ]
            : []),
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
                  { key: '4', icon: <LogoutOutlined className='mr-2' />, label: 'Rời nhóm' },
                  { key: '5', icon: <UserAddOutlined className='mr-2' />, label: 'Yêu cầu vào nhóm' }
              ]
            : [])
    ];

    const getLevelKeys = (items) => {
        const key = {};
        const func = (items, level = 1) => {
            items.forEach((item) => {
                if (item.key) key[item.key] = level;
                if (item.children) func(item.children, level + 1);
            });
        };
        func(items);
        return key;
    };

    const levelKeys = getLevelKeys(items);

    const onOpenChange = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => !stateOpenKeys.includes(key));
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

    const handleChangeDetails = (type) => {
        setChangeDetailsType(type);
        setIsChangeDetailsVisible(true);
    };

    const handleCloseChangeDetails = () => {
        setIsChangeDetailsVisible(false);
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
                <FileMediaLinks
                    stateOpenKeys={stateOpenKeys}
                    onOpenChange={onOpenChange}
                    items={items}
                    chatRoomId={currentChatRoomId}
                />
            ) : (
                <div className='flex flex-col items-center'>
                    <Avatar src={chatRoomImage} size={60} className='mt-3' />
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
            {isChangeDetailsVisible && (
                <ChangeDetails
                    type={changeDetailsType}
                    chatRoomId={currentChatRoomId}
                    onClose={handleCloseChangeDetails}
                />
            )}
        </Drawer>
    );
};

export default ChatInfoSidebar;
