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
                              <div className='relative'>
                                  <Avatar src={user.avatar} className='avatar' />
                                  <span className='border-white-default absolute bottom-0 right-3 h-4 w-4 rounded-full border-2 bg-green-500'></span>
                              </div>
                              <h1>{user.name}</h1>
                          </div>
                      ))}
            </div>
        </div>
    );
};

OnlineUsers.propTypes = {};

export default OnlineUsers;
