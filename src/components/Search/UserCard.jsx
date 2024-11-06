import { Avatar, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserCard = ({ data }) => {
    const { name, email, avatar, isFriend = false, _id } = data;
    const navigate = useNavigate();

    return (
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
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isFriend) {
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
