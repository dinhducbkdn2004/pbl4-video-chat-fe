import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import userApi from '../../apis/userApi';
import authApi from '../../apis/authApi';
import { Button, Image, Modal, Input, notification, Skeleton } from 'antd';
import Container from '../../components/Container';
import EditProfile from '../../components/UserPage/EditProfile';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import RoomChatApi from '../../apis/RoomChatApi';
import './UserPage.css';

const UserPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [caption, setCaption] = useState('');
    const { user: currentUser } = useSelector(authSelector);
    const { isLoading, fetchData, contextHolder } = useFetch({ showSuccess: true, showError: true });
    const navigate = useNavigate();
    console.log('user: ', user);

    const handleContact = async () => {
        const { data, isOk } = await RoomChatApi.getOneToOneChatRoom(id);
        if (isOk)
            navigate(`/message/${data._id}`, {
                state: {
                    name: user.name,
                    chatRoomImage: user.avatar,
                    typeRoom: 'OneToOne'
                }
            });
    };

    const handleAddFriend = async () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        const response = await fetchData(() => userApi.addFriend({ friendId: id, caption }));
        if (response.isOk) {
            setUser((prevUser) => ({ ...prevUser, isFriend: true }));
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleRevokeRequest = async () => {
        const response = await fetchData(() => userApi.revokeRequest(id));
    };

    useEffect(() => {
        (async () => {
            if (currentUser?._id === id) setUser(currentUser);
            const data = await fetchData(() => userApi.getUser(id));

            if (data.isOk) {
                setUser(data.data);
            }
        })();
    }, [currentUser, id, fetchData]);

    const handleRemoveFriend = async () => {
        const response = await fetchData(() => userApi.removeFriend(id));
        if (response.isOk) {
            setUser((prevUser) => ({ ...prevUser, isFriend: false }));
        }
    };

    return (
        <>
            {contextHolder}
            <Skeleton
                loading={isLoading}
                active
                className='custom-skeleton'
                avatar={{ size: 180 }}
                title={{ width: '100%' }}
                paragraph={{ rows: 3, width: '100%' }}
            >
                <Container>
                    <Image width={'100%'} height={300} src={user?.backgroundImage} className='background-image' />
                    <div className='profile-container'>
                        <Image src={user?.avatar} className='avatar' width={220} height={220} />
                        <h1 className='user-name dark:text-white-default'>{user?.name}</h1>
                        <div className='action-buttons'>
                            {currentUser && currentUser._id !== id && (
                                <>
                                    {user?.isFriend ? (
                                        <Button onClick={handleRemoveFriend}>Huỷ kết bạn</Button>
                                    ) : (
                                        <Button onClick={handleAddFriend}>Kết bạn</Button>
                                    )}
                                    <Button onClick={handleContact}>Nhắn tin</Button>
                                </>
                            )}

                            {currentUser && currentUser._id === id && user && (
                                <>
                                    <EditProfile data={user} />
                                </>
                            )}
                        </div>
                    </div>
                    <div className='introduction dark:text-white-default'>
                        <p>{user?.introduction}</p>
                    </div>
                    <Modal
                        title='Kết bạn'
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        className='dark:bg-black-light dark:text-white-default'
                    >
                        <Input
                            placeholder='Nhập mô tả...'
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            required
                            className='dark:bg-black-light dark:text-white-default'
                        />
                    </Modal>
                </Container>
            </Skeleton>
        </>
    );
};

export default UserPage;
