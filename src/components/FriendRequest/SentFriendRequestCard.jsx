import React from 'react';
import PropTypes from 'prop-types';
import { Card, Avatar, Button } from 'antd';

const SentFriendRequestCard = ({ request, onRevoke }) => {
    const { receiver, caption } = request;

    return (
        <Card className='friend-request-card'>
            <Card.Meta
                avatar={<Avatar src={receiver.avatar} />}
                title={receiver.name}
                description={caption || 'No caption provided'}
            />
            <div className='mt-4 flex justify-end gap-2'>
                <Button onClick={onRevoke}>Revoke</Button>
            </div>
        </Card>
    );
};

SentFriendRequestCard.propTypes = {
    request: PropTypes.shape({
        receiver: PropTypes.shape({
            avatar: PropTypes.string,
            name: PropTypes.string
        }).isRequired,
        caption: PropTypes.string
    }).isRequired,
    onRevoke: PropTypes.func.isRequired
};

export default SentFriendRequestCard;
