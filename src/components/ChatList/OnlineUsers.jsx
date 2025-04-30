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
        };

        fetchChatRooms();
    }, [onlineUsers]);

    const handleUserClick = (userId) => {
        const chatRoom = oneToOneRooms.find(
            (room) =>
                room.typeRoom === 'OneToOne' && room.participants.some((participant) => participant._id === userId)
        );
        if (chatRoom) {
            handleChatClick(chatRoom);
        }
    };

    return (
        <div className='online-now rounded-lg bg-white-default dark:bg-black-light dark:text-white-default'>
            <h4 className='dark:text-white-default'>Online Now</h4>
            <div className='avatars font-size-sm text-sm'>
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
                                      <Badge className='cursor-pointer' dot color='#52c41a' offset={[-6, 37]}>
                                          <Avatar src={user.avatar} size={43} />
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
    handleChatClick: PropTypes.func.isRequired
};

export default OnlineUsers;
