import { Avatar, Badge, Space } from 'antd';
import { useSocket } from './../../hooks/useSocket';
import { truncateString } from '../../helpers/utils';
import useFetch from '../../hooks/useFetch';
import PropTypes from 'prop-types';
import RoomChatApi from '../../apis/RoomChatApi';
import { useEffect, useState } from 'react';

const OnlineUsers = () => {
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

    return (
        <div className='online-now bg-white-default'>
            <h4 className='text-gray'>Online Now</h4>
            <div className='avatars gap-x-5 bg-white-default'>
                {onlineUsers.length === 0
                    ? 'No one online now'
                    : onlineUsers.map((user, index) => (
                          <div key={user.userId || index} className='flex flex-col items-center'>
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

OnlineUsers.propTypes = {};

export default OnlineUsers;
