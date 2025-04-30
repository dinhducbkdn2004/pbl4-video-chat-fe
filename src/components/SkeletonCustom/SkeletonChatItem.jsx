import React from 'react';
import { List, Skeleton, Avatar } from 'antd';

const SkeletonChatItem = () => (
    <List.Item className='list-item'>
        <Skeleton avatar title={false} loading={true} active>
            <List.Item.Meta
                avatar={<Avatar shape='circle' />}
                title={
                    <div className='meta'>
                        <span className='title'></span>
                    </div>
                }
                description={<div className='description'></div>}
            />
        </Skeleton>
    </List.Item>
);

export default SkeletonChatItem;
