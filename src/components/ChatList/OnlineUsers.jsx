import { Avatar, Badge, Space } from 'antd';
import { useSocket } from './../../hooks/useSocket';
import { truncateString } from '../../helpers/utils';

const OnlineUsers = () => {
    const { onlineUsers } = useSocket();
    console.log('onlineUsers', onlineUsers);

    return (
        <div className='online-now'>
            <h4>Online Now</h4>
            <div className='avatars gap-x-5'>
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
