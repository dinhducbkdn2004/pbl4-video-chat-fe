import React from 'react';
import { Avatar, Dropdown, Menu, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const MemberItem = ({ member, handleRemoveMember, handleChangeRole, currentUser, currentUserRole }) => {
    const menu = (
        <Menu>
            <Menu.Item key='remove' onClick={() => handleRemoveMember(member._id)}>
                Xóa thành viên
            </Menu.Item>
            {currentUserRole === 'Admin' && (
                <Menu.SubMenu key='changeRole' title='Thay đổi vai trò'>
                    <Menu.Item key='admin' onClick={() => handleChangeRole(member._id, 'admin')}>
                        Admin
                    </Menu.Item>
                    <Menu.Item key='member' onClick={() => handleChangeRole(member._id, 'moderator')}>
                        Moderator
                    </Menu.Item>
                </Menu.SubMenu>
            )}
        </Menu>
    );

    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center'>
                <Avatar src={member.avatar} size='small' className='mr-2' />
                {member.name}
            </div>
            {member._id !== currentUser._id && currentUserRole !== 'Member' && (
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button type='text' icon={<EllipsisOutlined />} />
                </Dropdown>
            )}
        </div>
    );
};

export default MemberItem;
