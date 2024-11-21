import { Avatar, Button, Card, Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import RoomChatApi from '../../apis/RoomChatApi';
import userApi from '../../apis/userApi';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';

const UserCard = ({ data }) => {
    const { fetchData } = useFetch({ showError: true, showSuccess: true  });
    const { name, email, avatar, isFriend = false, _id } = data;
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [caption, setCaption] = useState('');
    const [friendStatus, setFriendStatus] = useState(isFriend);

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
                        <h2 className='text-black text-base'>{email}</h2>
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
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder='Nhập mô tả cho lời mời kết bạn'
                />
            </Modal>
        </>
    );
};

UserCard.propTypes = {
    data: PropTypes.object.isRequired
};

export default UserCard;
