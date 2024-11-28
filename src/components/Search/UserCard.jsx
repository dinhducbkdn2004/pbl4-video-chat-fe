import { Avatar, Button, Card, Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import RoomChatApi from '../../apis/RoomChatApi';
import userApi from '../../apis/userApi';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';

const UserCard = ({ data }) => {
    const { fetchData } = useFetch({ showError: false, showSuccess: false });
    const { name, introduction, avatar, isFriend = false, _id } = data;
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [friendStatus, setFriendStatus] = useState(isFriend);
    const { user: currentUser } = useSelector(authSelector);
    const [caption, setCaption] = useState(
        `Xin chào mình là ${currentUser.name}, mình biết bạn qua Connectica. Làm bạn với mình nhé!`
    );
    const handleChatClick = async (e) => {
        e.stopPropagation();
        if (friendStatus) {
            const response = await fetchData(() => RoomChatApi.getOneToOneChatRoom(_id));
            const roomId = response.data._id;
            navigate(`/message/${roomId}`);
        } else {
            setIsModalVisible(true);
        }
    };

    const handleAddFriend = async () => {
        const response = await fetchData(() => userApi.addFriend({ friendId: _id, caption }));
        if (response.isOk) {
            setFriendStatus(true);
            setIsModalVisible(false);
        }
    };

    return (
        <>
            <Card
                onClick={() => {
                    navigate(`/user/${_id}`);
                }}
                className='cursor-pointer transition-transform duration-300 ease-in-out hover:shadow-md'
            >
                <div className='bg-white flex items-center gap-2.5 rounded-2xl'>
                    <Avatar src={avatar} size={40} />
                    <div className='flex-1'>
                        <h1 className='text-black text-lg'>{name}</h1>
                        <h2 className='text-small text-gray'>{introduction}</h2>
                    </div>
                    <Button onClick={handleChatClick}>{friendStatus ? 'Nhắn tin' : 'Kết bạn'}</Button>
                </div>
            </Card>
            <Modal
                title='Nhập mô tả'
                visible={isModalVisible}
                onOk={handleAddFriend}
                onCancel={() => setIsModalVisible(false)}
            >
                <Input.TextArea
                    style={{ height: '100px', width: '100%' }}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder='Nhập mô tả cho lời mời kết bạn'
                    maxLength={150}
                />
            </Modal>
        </>
    );
};

UserCard.propTypes = {
    data: PropTypes.object.isRequired
};

export default UserCard;
