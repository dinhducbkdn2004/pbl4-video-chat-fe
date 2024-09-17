import { Avatar } from 'antd';
import { useSocket } from './../../hooks/useSocket';

const OnlineUsers = () => {
    const { onlineUsers } = useSocket();

    return (
        <div className='online-now'>
            <h4>Online Now</h4>
            <div className='avatars gap-x-5'>
                {onlineUsers.length === 0
                    ? 'No one onlines now'
                    : onlineUsers.map((user, index) => (
                          <div key={user.userId || index} className='flex flex-col items-center'>
                              <Avatar src={user.avatar} className='avatar' />
                              <h1>{user.name}</h1>
                          </div>
                      ))}
            </div>
        </div>
    );
};

OnlineUsers.propTypes = {};

export default OnlineUsers;
