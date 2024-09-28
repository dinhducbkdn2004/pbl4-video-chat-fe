import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Avatar, Badge } from 'antd';
import { getLastName } from '../helpers/utils';
import { authSelector } from '../redux/features/auth/authSelections';

const MessageComponent = ({ msg, members }) => {
    const { user: currentUser } = useSelector(authSelector);
    const { sender, content, createdAt } = msg;
    return (
        <div className={`mb-4 flex ${sender._id === currentUser._id ? 'justify-end' : ''}`}>
            {sender._id !== currentUser._id && (
                <Badge
                    className='mr-2 flex items-center'
                    dot={members?.find((member) => member._id === sender._id)?.isOnline}

                    color='#52c41a'
                    size='small'
                    offset={[-5, 50]}
                >
                    <Avatar src={sender.avatar} className='avatar' />
                </Badge>
            )}
            <div className={`flex flex-col ${sender._id === currentUser._id ? 'items-end' : 'items-start'}`}>
                <div className='mb-1 text-xs' style={{fontSize: '12px'}}>{getLastName(sender.name)}</div>
                <div
                    className={`inline-block max-w-xs rounded-2xl px-4 py-2 text-sm ${
                        sender._id === currentUser._id
                            ? 'ml-auto bg-blue-500 text-white-default'
                            : 'text-black mr-auto bg-green-defaut'
                    }`}
                >
                    {content}
                </div>
                <div className='text-gray-500 mt-1 flex items-center text-xs' style={{ fontSize: '11px' }}>
                    <span>{new Date(createdAt).toLocaleTimeString()}</span>
                    {sender._id === currentUser._id && (
                        <>
                            <span className='ml-1'>✔️</span>
                        </>
                    )}
                </div>
            </div>
            {sender._id === currentUser._id && (
                <Badge
                    className='ml-2 flex items-center'
                    dot={members.find((member) => member._id === sender._id)?.isOnline}
                    color='#52c41a'
                    size='small'
                    offset={[-5, 50]}
                >
                    <Avatar src={sender.avatar} className='avatar' />
                </Badge>
            )}
        </div>
    );
};

MessageComponent.propTypes = {
    msg: PropTypes.object.isRequired,
    members: PropTypes.arrayOf(PropTypes.object)
};

export default MessageComponent;
