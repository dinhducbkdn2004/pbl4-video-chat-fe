import { InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Popover, Tooltip } from 'antd';
import CallModal from './CallModal';
import { useSocket } from '../../hooks/useSocket';

const Header = ({ chatInfo, me, toggleSidebar }) => {
    const { onlineUsers } = useSocket();
    const currentUser = me || {};

    const { name: roomName, participants: members, typeRoom, chatRoomImage } = chatInfo || {};

    const isRoomOnline =
        members?.length >= 2 &&
        members.some((member) => onlineUsers.some((onlineUser) => onlineUser._id === member._id));

    return (
        <div className='flex h-[65px] items-center justify-between rounded-lg bg-white-default mb-3 p-4 dark:bg-black-light dark:text-white-default'>
            <div className='flex items-center'>
                {typeRoom === 'OneToOne' && members?.length > 0 && (
                    <Tooltip title={roomName}>
                        <Badge
                            className='mr-3'
                            dot={true}
                            color={
                                onlineUsers.find(
                                    (onlineUser) =>
                                        onlineUser._id === members.find((member) => member._id !== currentUser._id)._id
                                )
                                    ? '#52c41a'
                                    : '#B6B6B6'
                            }
                            offset={[-7, 35]}
                        >
                            <Avatar size='large' src={chatRoomImage}></Avatar>
                        </Badge>
                    </Tooltip>
                )}
                {typeRoom === 'Group' && <Avatar src={chatRoomImage} className='mr-3 object-cover' size={43}></Avatar>}
                <div>
                    <h4 className='m-0 text-base font-semibold'>{roomName}</h4>
                    <p
                        className='text-gray-600 m-0 text-sm'
                        style={{
                            color: isRoomOnline ? '#52c41a' : '#B6B6B6'
                        }}
                    >
                        {isRoomOnline ? 'Online now' : 'Offline'}
                    </p>
                </div>
            </div>
            <div className='flex items-center'>
                <ul className='m-0 flex list-none p-0'>
                    <li className='mr-5'></li>
                    <li className='mr-5'>
                        <CallModal />
                    </li>
                    <li className='mr-5'>
                        <Popover content='Contact Info' overlayStyle={{ borderRadius: '8px' }}>
                            <Button
                                icon={<InfoCircleOutlined />}
                                className='rounded-full p-3'
                                onClick={toggleSidebar}
                            />
                        </Popover>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
