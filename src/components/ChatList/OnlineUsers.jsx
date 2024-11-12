import { Avatar, Badge, Space } from 'antd';
import { useSocket } from './../../hooks/useSocket';
import { truncateString } from '../../helpers/utils';
import useFetch from '../../hooks/useFetch';
import PropTypes from 'prop-types';
import RoomChatApi from '../../apis/RoomChatApi';
import { useEffect, useState } from 'react';

const OnlineUsers = ({ handleChatClick }) => {
    const { onlineUsers } = useSocket();
    const { fetchData } = useFetch({ showSuccess: false, showError: false });
    const [oneToOneRooms, setOneToOneRooms] = useState([]);
    // console.log('online users', onlineUsers);
    useEffect(() => {
        const fetchChatRooms = async () => {
            const response = await fetchData(() => RoomChatApi.getAllChatrooms(true));
            const oneToOneRooms = response.data.filter(
                (room) =>
                    room.typeRoom === 'OneToOne' &&
                    room.participants.some((participant) => onlineUsers.some((user) => user._id === participant._id)) &&
                    room.participants.length === 2
            );
            setOneToOneRooms(oneToOneRooms);
            // console.log('one to one rooms', oneToOneRooms);
        };

        fetchChatRooms();
    }, [onlineUsers]);

    const handleUserClick = (userId) => {
        const chatRoom = oneToOneRooms.find(
            (room) =>
                room.typeRoom === 'OneToOne' && room.participants.some((participant) => participant._id === userId)
        );
        if (chatRoom) {
            // console.log('chat room', chatRoom);
            handleChatClick(chatRoom);
        }
    };

    return (
        <div className='online-now bg-white-default'>
            <h4 className='text-gray'>Online Now</h4>
            <div className='avatars gap-x-5 bg-white-default'>
                {onlineUsers.length === 0
                    ? 'No one online now'
                    : onlineUsers.map((user, index) => (
                          <div
                              key={user.userId || index}
                              className='flex flex-col items-center'
                              onClick={() => handleUserClick(user._id)}
                          >
                              <div className='relative'>
                                  <Space>
                                      <Badge dot color='#52c41a' size='small' offset={[-16, 40]}>
                                          <Avatar src={user.avatar} className='avatar' />
                                      </Badge>
                                  </Space>
                              </div>
                              <h1>{truncateString(user.name, 10)}</h1>
                          </div>
                      ))}
            </div>
        </div>
    );
};

OnlineUsers.propTypes = {
    recentChats: PropTypes.array.isRequired,
    handleChatClick: PropTypes.func.isRequired
};

export default OnlineUsers;
