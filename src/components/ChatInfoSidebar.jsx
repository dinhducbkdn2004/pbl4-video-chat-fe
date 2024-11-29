import { useState, useEffect } from 'react';
import { Drawer, message, List, Button, Avatar, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import ChangeDetails from '../components/ChatRoomDetail/ChangeDetails';
import FileMediaLinks from '../components/ChatRoomDetail/FileMediaLinks';
import RoomChatApi from '../apis/RoomChatApi';
import useFetch from '../hooks/useFetch';
import DrawerTitle from '../components/ChatRoomDetail/DrawerTitle';
import ChatRoomDetails from '../components/ChatRoomDetail/ChatRoomDetails';
import MemberItem from '../components/ChatRoomDetail/MemberItem';
import { InboxOutlined, MailOutlined, AppstoreOutlined, LogoutOutlined, UserAddOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ChatInfoSidebar = ({ chatInfo, me, open, onClose, updateChatInfo }) => {
    const { chatRoomId: currentChatRoomId } = useParams();
    const { name: roomName, participants: members, typeRoom, chatRoomImage, admins, moderators } = chatInfo || {};
    const currentUser = me || {};
    const { fetchData, contextHolder } = useFetch({ showSuccess: false, showError: false });
    const [isChangeDetailsVisible, setIsChangeDetailsVisible] = useState(false);
    const [changeDetailsType, setChangeDetailsType] = useState('');
    const [stateOpenKeys, setStateOpenKeys] = useState(['1']);
    const [drawerTitle, setDrawerTitle] = useState('Chat Room Detail');
    const [isFileView, setIsFileView] = useState(false);
    const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);
    const [requests, setRequests] = useState([]);
    const [isRequestsView, setIsRequestsView] = useState(false);
    const [requestsCount, setRequestsCount] = useState(0);

    useEffect(() => {
        const fetchRequestsCount = async () => {
            const response = await fetchData(() => RoomChatApi.getRequestByChatRoomId(currentChatRoomId));
            setRequestsCount(response.data.length);
        };

        fetchRequestsCount();
    }, [fetchData, currentChatRoomId]);

    const getRole = (memberId) => {
        if (admins && admins.some((admin) => admin._id === memberId)) return 'Admin';
        if (moderators && moderators.some((moderator) => moderator._id === memberId)) return 'Moderator';
        return 'Member';
    };

    const handleRemoveMember = async (memberId) => {
        const currentUserRole = getRole(currentUser._id);
        const memberRole = getRole(memberId);

        if (currentUserRole === 'Admin' || (currentUserRole === 'Moderator' && memberRole === 'Member')) {
            await fetchData(() => RoomChatApi.removeMember(currentChatRoomId, memberId));
        }
        await updateChatInfo();
    };

    const handleChangeRole = async (memberId, newRole) => {
        await fetchData(() => RoomChatApi.changeRole(currentChatRoomId, memberId, newRole));
        await updateChatInfo();
    };

    const handleLeaveGroup = async () => {
        await fetchData(() => RoomChatApi.leaveGroup(currentChatRoomId));
    };

    const handleFetchRequests = async () => {
        const response = await fetchData(() => RoomChatApi.getRequestByChatRoomId(currentChatRoomId));
        setRequests(response.data);
        setDrawerTitle('Yêu cầu vào nhóm');
        setIsRequestsView(true);
        setIsBackButtonVisible(true);
    };

    const handleAcceptRequest = async (requestId) => {
        await fetchData(() => RoomChatApi.updatedRequest(requestId, 'ACCEPTED'));
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
        setRequestsCount((prevCount) => prevCount - 1);
        await updateChatInfo();
    };

    const handleRejectRequest = async (requestId) => {
        await fetchData(() => RoomChatApi.updatedRequest(requestId, 'DECLINED'));
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
        setRequestsCount((prevCount) => prevCount - 1);
        await updateChatInfo();
    };

    const createMemberItems = (role) =>
        members
            .filter((member) => getRole(member._id) === role)
            .map((member, index) => ({
                key: `${role}-${index + 1}`,
                label: (
                    <MemberItem
                        member={member}
                        handleRemoveMember={handleRemoveMember}
                        handleChangeRole={handleChangeRole}
                        currentUser={currentUser}
                        currentUserRole={getRole(currentUser._id)}
                        updateChatInfo={updateChatInfo}
                    />
                )
            }));

    const currentUserRole = getRole(currentUser._id);
    const items = [
        ...(currentUserRole !== 'Member' && currentUserRole !== 'Moderator'
            ? [
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
                  }
              ]
            : []),
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
                  { key: '4', icon: <LogoutOutlined className='mr-2' />, label: 'Rời nhóm', onClick: handleLeaveGroup },
                  ...(currentUserRole !== 'Member'
                      ? [
                            {
                                key: '5',
                                icon: <UserAddOutlined className='mr-2' />,
                                label: `Yêu cầu vào nhóm (${requestsCount})`,
                                onClick: handleFetchRequests
                            }
                        ]
                      : [])
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
        setIsRequestsView(false);
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
        <>
            {contextHolder}
            <Drawer
                title={
                    <DrawerTitle
                        isBackButtonVisible={isBackButtonVisible}
                        drawerTitle={drawerTitle}
                        handleBack={handleBack}
                    />
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
                ) : isRequestsView ? (
                    <List
                        itemLayout='vertical'
                        dataSource={requests.reverse()}
                        renderItem={(request) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={request.createBy.avatar} />}
                                    title={
                                        <div>
                                            <Text strong>{request.createBy.name}</Text>
                                            <Text type='secondary' style={{ marginLeft: '10px', fontSize: '11px' }}>
                                                {moment(request.createdAt).format('DD/MM/YYYY HH:mm')}
                                            </Text>
                                        </div>
                                    }
                                    description={request.message}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <Button
                                        key={`accept-${request._id}`}
                                        type='primary'
                                        onClick={() => handleAcceptRequest(request._id)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Chấp nhận
                                    </Button>
                                    <Button
                                        key={`reject-${request._id}`}
                                        type='default'
                                        onClick={() => handleRejectRequest(request._id)}
                                    >
                                        Từ chối
                                    </Button>
                                </div>
                            </List.Item>
                        )}
                    />
                ) : (
                    <ChatRoomDetails
                        chatRoomImage={chatRoomImage}
                        roomName={roomName}
                        stateOpenKeys={stateOpenKeys}
                        onOpenChange={onOpenChange}
                        items={items}
                    />
                )}
                {isChangeDetailsVisible && (
                    <ChangeDetails
                        type={changeDetailsType}
                        chatRoomId={currentChatRoomId}
                        onClose={handleCloseChangeDetails}
                        updateChatInfo={updateChatInfo}
                    />
                )}
            </Drawer>
        </>
    );
};

export default ChatInfoSidebar;
