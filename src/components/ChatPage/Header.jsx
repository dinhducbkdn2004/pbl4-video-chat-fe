import { InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Popover, Tooltip } from 'antd';

import { useLocation } from 'react-router-dom';
import CallModal from './CallModal';

const Header = () => {
    const location = useLocation();

    const { name: roomName, participants: members, typeRoom, chatRoomImage, isOnline } = location.state;

    return (
        <div className='flex h-[73px] items-center justify-between border-b border-[#e0e0e0] bg-white-default p-4'>
            <div className='flex items-center'>
                {typeRoom === 'OneToOne' && (
                    <Tooltip title={roomName}>
                        <Badge dot={true} color={isOnline ? '#52c41a' : 'red'} offset={[-5, 35]}>
                            <Avatar src={chatRoomImage}></Avatar>
                        </Badge>
                    </Tooltip>
                )}
                {typeRoom === 'Group' && (
                    <Avatar.Group
                        className='m-3'
                        size='large'
                        max={{ count: 2, style: { color: '#f56a00', backgroundColor: '#fde3cf' } }}
                    >
                        {members?.map((member, index) => (
                            <Tooltip key={index} title={member.name}>
                                <Badge dot color={isOnline ? '#52c41a' : 'red'} offset={[-5, 35]}>
                                    <Avatar src={member.avatar}></Avatar>
                                </Badge>
                            </Tooltip>
                        ))}
                    </Avatar.Group>
                )}
                <div>
                    <h4 className='m-0 text-base font-semibold'>{roomName}</h4>
                    <p className='text-gray-600 m-0 text-sm'>Last Seen at 07:15PM</p>
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
                            <Button icon={<InfoCircleOutlined />} className='rounded-full p-3' />
                        </Popover>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
