import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Avatar, Badge } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { getLastName } from '../helpers/utils';
import { authSelector } from '../redux/features/auth/authSelections';
import { useSocket } from '../hooks/useSocket';

const MessageComponent = ({ msg }) => {
    const { user: currentUser } = useSelector(authSelector);
    const { sender, content, createdAt } = msg;
    const { onlineUsers } = useSocket();
    return (
        <div className={`mb-4 flex ${sender._id === currentUser._id ? 'justify-end' : ''}`}>
            {sender._id !== currentUser._id && (
                <Badge
                    className='mr-2 flex items-center'
                    dot={onlineUsers.find((onlineUser) => onlineUser._id === sender._id)}
                    color='#52c41a'
                    size='small'
                    offset={[-5, 50]}
                >
                    <Avatar src={sender.avatar} className='avatar' />
                </Badge>
            )}
            <div className={`flex flex-col ${sender._id === currentUser._id ? 'items-end' : 'items-start'}`}>
                <div className='mb-1 text-xs font-medium' style={{ fontSize: '12px' }}>
                    {getLastName(sender.name)}
                </div>
                <div
                    className={`inline-block max-w-xs rounded-2xl px-4 py-2 text-sm ${
                        sender._id === currentUser._id
                            ? 'ml-auto bg-blue-500 text-white-default'
                            : 'text-black mr-auto bg-white-dark'
                    }`}
                >
                    {content}
                </div>
                <div className='text-gray-500 mt-1 flex items-center text-xs' style={{ fontSize: '10px' }}>
                    <span>{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {sender._id === currentUser._id && (
                        <>
                            <CheckCircleTwoTone className='ml-1' />
                        </>
                    )}
                </div>
            </div>
            {sender._id === currentUser._id && (
                <Badge className='ml-2 flex items-center' dot color='#52c41a' size='small' offset={[-5, 50]}>
                    <Avatar src={sender.avatar} className='avatar' />
                </Badge>
            )}
        </div>
    );
};

MessageComponent.propTypes = {
    msg: PropTypes.object.isRequired
};

export default MessageComponent;
