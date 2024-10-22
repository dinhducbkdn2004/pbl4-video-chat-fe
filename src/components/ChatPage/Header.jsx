import { InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Popover, Tooltip } from 'antd';
import { useLocation } from 'react-router-dom';
import CallModal from './CallModal';
import { useSocket } from '../../hooks/useSocket';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';

const Header = ({ toggleSidebar }) => {
    const location = useLocation();
    const { onlineUsers } = useSocket();
    const { user: currentUser } = useSelector(authSelector);

    const { name: roomName, participants: members, typeRoom, chatRoomImage } = location.state;

    const isRoomOnline =
        members?.length >= 2 &&
        members.some((member) => onlineUsers.some((onlineUser) => onlineUser._id === member._id));

    return (
        <div className='flex h-[73px] items-center justify-between border-b border-[#e0e0e0] bg-white-default p-4'>
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
                {typeRoom === 'Group' && (
                    // <Avatar.Group
                    //     className='m-3'
                    //     size='small'
                    //     max={{ count: 2, style: { color: '#f56a00', backgroundColor: '#fde3cf' } }}
                    // >
                    //     {members?.map((member, index) => (
                    //         <Tooltip key={index} title={member.name}>
                    //             <Badge
                    //                 dot
                    //                 color={
                    //                     onlineUsers.some(
                    //                         (onlineUser) =>
                    //                             onlineUser._id === member._id || member._id === currentUser._id
                    //                     )
                    //                         ? '#52c41a'
                    //                         : '#B6B6B6'
                    //                 }
                    //                 offset={[-5, 35]}
                    //             >
                    //                 <Avatar size='large' src={member.avatar}></Avatar>
                    //             </Badge>
                    //         </Tooltip>
                    //     ))}
                    // </Avatar.Group>

                    <Avatar
                        src={chatRoomImage}
                        className='mr-3 object-cover'
                        size={43}
                    ></Avatar>
                )}
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
