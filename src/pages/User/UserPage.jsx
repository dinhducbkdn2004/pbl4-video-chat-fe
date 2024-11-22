import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import userApi from '../../apis/userApi';
import authApi from '../../apis/authApi';
import Loading from '../../components/Loading/Loading';
import { Button, Image, Modal, Input } from 'antd';
import Container from '../../components/Container';
import EditProfile from '../../components/UserPage/EditProfile';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import RoomChatApi from '../../apis/RoomChatApi';

const UserPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [caption, setCaption] = useState('');
    const { user: currentUser } = useSelector(authSelector);
    const { isLoading, fetchData, contextHolder } = useFetch({ showSuccess: true, showError: true });
    const navigate = useNavigate();

    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
        userApi.addFriend({ friendId: id, caption });
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showEmailModal = () => {
        setIsEmailModalVisible(true);
    };

    const handleSendOtp = async () => {
        await fetchData(() => authApi.forgotPassword(email));
        setIsEmailModalVisible(false);
        setIsResetPasswordModalVisible(true);
    };

    const handleResetPassword = async () => {
        const response = await fetchData(() => authApi.resetPassword(email, otp, newPassword, confirmPassword));
        if (response.isOk) {
            setIsResetPasswordModalVisible(false);
            setEmail('');
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
        }
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

    if (isLoading || !user) return <Loading />;

    return (
        <>
            {contextHolder}
            <Container>
                <Image width={'100%'} src={user.backgroundImage} />
                <div className='relative -top-[100px] flex flex-col items-center gap-y-6'>
                    <Image src={user.avatar} className='mx-auto rounded-full object-cover' width={240} height={240} />
                    <h1 className='mb-5 text-center'>{user.name}</h1>
                    <div className='flex items-center justify-center gap-x-4'>
                        {currentUser._id !== id && (
                            <>
                                <Button onClick={handleAddFriend}>Thêm bạn bè</Button>
                                <Button onClick={handleContact}>Nhắn tin</Button>
                            </>
                        )}

                        {currentUser._id === id && (
                            <>
                                <EditProfile data={user} />
                                <Button onClick={showEmailModal}>Change Password</Button>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <p className='mx-auto max-w-[400px] text-center'>{user.introduction}</p>
                </div>
                <Modal title='Kết bạn' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Input placeholder='Nhập mô tả...' value={caption} onChange={(e) => setCaption(e.target.value)} />
                </Modal>
                <Modal
                    title='Nhập Email'
                    visible={isEmailModalVisible}
                    onOk={handleSendOtp}
                    onCancel={() => setIsEmailModalVisible(false)}
                >
                    <Input
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                </Modal>
                <Modal
                    title='Change Password'
                    visible={isResetPasswordModalVisible}
                    onOk={handleResetPassword}
                    onCancel={() => setIsResetPasswordModalVisible(false)}
                >
                    <Input
                        placeholder='OTP'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <Input.Password
                        placeholder='Mật khẩu mới'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <Input.Password
                        placeholder='Xác nhận mật khẩu'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Modal>
            </Container>
        </>
    );
};

export default UserPage;