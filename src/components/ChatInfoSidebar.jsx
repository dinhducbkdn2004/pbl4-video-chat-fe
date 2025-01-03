import { useState, useEffect } from 'react';
import { Drawer, message, List, Button, Avatar, Typography, notification } from 'antd';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import ChangeDetails from '../components/ChatRoomDetail/ChangeDetails';
import FileMediaLinks from '../components/ChatRoomDetail/FileMediaLinks';
import RoomChatApi from '../apis/RoomChatApi';
import useFetch from '../hooks/useFetch';
import DrawerTitle from '../components/ChatRoomDetail/DrawerTitle';
import ChatRoomDetails from '../components/ChatRoomDetail/ChatRoomDetails';
import MemberItem from '../components/ChatRoomDetail/MemberItem';
import {
    InboxOutlined,
    MailOutlined,
    AppstoreOutlined,
    LogoutOutlined,
    UserAddOutlined,
    LinkOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const ChatInfoSidebar = ({ chatInfo, me, open, onClose, updateChatInfo }) => {
    const navigate = useNavigate();
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
            notification.success({
                message: 'Success',
                description: 'Member removed successfully!'
            });
        } else {
            notification.error({
                message: 'Error',
                description: 'You do not have permission to remove this member.'
            });
        }
        await updateChatInfo();
    };

    const handleChangeRole = async (memberId, newRole) => {
        await fetchData(() => RoomChatApi.changeRole(currentChatRoomId, memberId, newRole));
        await updateChatInfo();
    };

    const handleLeaveGroup = async () => {
        if (admins.length === 1 && admins[0]._id === currentUser._id) {
            notification.error({
                message: 'Error',
                description: 'You must appoint another Admin before leaving the group!'
            });
            return;
        }
        const response = await fetchData(() => RoomChatApi.leaveGroup(currentChatRoomId));
        if (response) {
            onClose();
            navigate('/message');
        } else {
            notification.error({
                message: 'Error',
                description: 'Failed to leave group!'
            });
        }
    };

    const handleFetchRequests = async () => {
        const response = await fetchData(() => RoomChatApi.getRequestByChatRoomId(currentChatRoomId));
        setRequests(response.data);
        setDrawerTitle('Join Requests');
        setIsRequestsView(true);
        setIsBackButtonVisible(true);
    };

    const handleAcceptRequest = async (requestId) => {
        await fetchData(() => RoomChatApi.updatedRequest(requestId, 'ACCEPTED'));
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
        setRequestsCount((prevCount) => prevCount - 1);
        notification.success({
            message: 'Success',
            description: 'Request accepted successfully!'
        });
        await updateChatInfo();
    };

    const handleRejectRequest = async (requestId) => {
        await fetchData(() => RoomChatApi.updatedRequest(requestId, 'DECLINED'));
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
        setRequestsCount((prevCount) => prevCount - 1);
        notification.success({
            message: 'Success',
            description: 'Request rejected successfully!'
        });
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

    const handleShareLink = () => {
        const groupLink = `${window.location.origin}/join-group/${currentChatRoomId}`;
        navigator.clipboard.writeText(groupLink);
        message.success('Group link copied to clipboard!');
    };

    const currentUserRole = getRole(currentUser._id);
    const items = [
        ...(currentUserRole !== 'Member' && currentUserRole !== 'Moderator'
            ? [
                  {
                      key: '1',
                      icon: <MailOutlined className='dark:text-white-default' />,
                      label: 'Chat Settings',
                      children: [
                          { key: '1-1', label: 'Change Chat Name', onClick: () => handleChangeDetails('name') },
                          ...(typeRoom === 'Group'
                              ? [{ key: '1-2', label: 'Change Image', onClick: () => handleChangeDetails('image') }]
                              : [])
                      ]
                  }
              ]
            : []),
        ...(typeRoom === 'Group'
            ? [
                  {
                      key: '2',
                      icon: <AppstoreOutlined className='dark:text-white-default' />,
                      label: 'Chat Members',
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
            icon: <InboxOutlined className='dark:text-white-default' />,
            label: 'Media, Files, and Links',
            children: [
                { key: '3-1', label: 'Media' },
                { key: '3-2', label: 'Files' },
                { key: '3-3', label: 'Links' }
            ]
        },
        ...(typeRoom === 'Group'
            ? [
                  {
                      key: '4',
                      icon: <LogoutOutlined className='mr-2 dark:text-white-default' />,
                      label: 'Leave Group',
                      onClick: handleLeaveGroup
                  },
                  ...(currentUserRole !== 'Member'
                      ? [
                            {
                                key: '5',
                                icon: <UserAddOutlined className='mr-2 dark:text-white-default' />,
                                label: `Join Requests (${requestsCount})`,
                                onClick: handleFetchRequests
                            }
                        ]
                      : []),
                  {
                      key: '6',
                      icon: <LinkOutlined className='mr-2 dark:text-white-default' />,
                      label: 'Share Group Link',
                      onClick: handleShareLink
                  }
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
                setDrawerTitle('Media, Files, and Links');
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
                className='bg-white-default dark:bg-black-default dark:text-white-default'
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
                                        Accept
                                    </Button>
                                    <Button
                                        key={`reject-${request._id}`}
                                        type='default'
                                        onClick={() => handleRejectRequest(request._id)}
                                    >
                                        Reject
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
