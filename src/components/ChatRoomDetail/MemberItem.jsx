import React from 'react';
import { Avatar, Dropdown, Menu, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const MemberItem = ({ member, handleRemoveMember, handleChangeRole, currentUser, currentUserRole, updateChatInfo }) => {
    const menu = (
        <Menu className='dark:bg-black-light dark:text-white-default'>
            <Menu.Item key='remove' onClick={async () => {
                await handleRemoveMember(member._id);
                await updateChatInfo();
            }}>
                Xóa thành viên
            </Menu.Item>
            {currentUserRole === 'Admin' && (
                <Menu.SubMenu key='changeRole' title='Thay đổi vai trò'>
                    <Menu.Item key='admin' onClick={async () => {
                        await handleChangeRole(member._id, 'admin');
                        await updateChatInfo();
                    }}>
                        Admin
                    </Menu.Item>
                    <Menu.Item key='moderator' onClick={async () => {
                        await handleChangeRole(member._id, 'moderator');
                        await updateChatInfo();
                    }}>
                        Moderator
                    </Menu.Item>
                </Menu.SubMenu>
            )}
        </Menu>
    );

    return (
        <div className='flex items-center justify-between dark:text-white-default'>
            <div className='flex items-center'>
                <Avatar src={member.avatar} size='small' className='mr-2' />
                {member.name}
            </div>
            {member._id !== currentUser._id && currentUserRole !== 'Member' && (
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button type='text' icon={<EllipsisOutlined />} className='dark:text-white-default' />
                </Dropdown>
            )}
        </div>
    );
};

export default MemberItem;