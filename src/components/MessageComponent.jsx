import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { authActions } from '../redux/features/auth/authSlice';
import { Avatar, Badge } from 'antd';
import { getLastName } from '../helpers/utils';
import { authSelector } from '../redux/features/auth/authSelections';

const MessageComponent = ({ msg, members }) => {
    const { user: currentUser } = useSelector(authSelector);
    const { sender, content } = msg;
    return (
        <div className={`mb-4 flex items-end ${sender._id === currentUser._id ? 'justify-end' : ''}`}>
            {sender._id !== currentUser._id && (
                <Badge
                    className='mr-2'
                    dot={members?.find((member) => member._id === sender._id)?.isOnline}
                    color='#52c41a'
                    size='small'
                    offset={[-5, 30]}
                >
                    <Avatar src={sender.avatar} className='avatar' />
                </Badge>
            )}
            <div className={`flex flex-col ${sender._id === currentUser._id ? 'items-end' : 'items-start'}`}>
                <div className='mb-1 text-xs'>{getLastName(sender.name)}</div>
                <div
                    className={`inline-block max-w-xs rounded-2xl px-4 py-2 text-sm ${
                        sender._id === currentUser._id
                            ? 'ml-auto bg-blue-500 text-white-default'
                            : 'text-black mr-auto bg-green-defaut'
                    }`}
                >
                    {content}
                </div>
            </div>
            {sender._id === currentUser._id && (
                <Badge className='ml-2' dot={true} color='#52c41a' size='small' offset={[-5, 30]}>
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
