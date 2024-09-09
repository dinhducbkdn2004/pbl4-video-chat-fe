import { Avatar, Button, Card } from 'antd';

import { useNavigate } from 'react-router-dom';
import { getSocket } from '../../configs/socketInstance';

import PropTypes from 'prop-types';

const UserCard = ({ data }) => {
    const { name, email, avatar, isFriend = false, _id } = data;
    const navigate = useNavigate();
    const socket = getSocket();

    return (
        <Card
            onClick={() => {
                navigate(`/user/${_id}`);
            }}
        >
            <div className='flex items-center gap-[10px] rounded-2xl bg-white-default'>
                {' '}
                <Avatar src={avatar} size={40} />
                <div
                    style={{
                        flex: 1
                    }}
                >
                    <h1 className='text-[17px] text-[#050505]'>{name}</h1>
                    <h2 className='text-[15px] text-[#050505]'>{email}</h2>
                </div>
                <Button
                    onClick={() => {
                        if (!isFriend) {
                            socket.emit('client-send-friend-request', {
                                recieverId: _id,
                                caption: 'Hãy kết bạn với tôi'
                            });
                            return;
                        }
                    }}
                >
                    {isFriend ? 'Nhắn tin' : 'Kết bạn'}
                </Button>
            </div>
        </Card>
    );
};
UserCard.propTypes = {
    data: PropTypes.object.isRequired
};

export default UserCard;
