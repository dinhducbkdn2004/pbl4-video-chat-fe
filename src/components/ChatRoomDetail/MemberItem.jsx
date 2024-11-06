import React, { useRef } from 'react';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const MemberItem = ({ member, handleRemoveMember }) => {
    const dropdownButtonRef = useRef(null);

    const menu = (
        <Menu>
            <Menu.Item key='remove' onClick={() => handleRemoveMember(member._id)}>
                Xóa thành viên
            </Menu.Item>
        </Menu>
    );

    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center'>
                <Avatar src={member.avatar} size='small' className='mr-2' />
                {member.name}
            </div>
            <Dropdown menu={menu} trigger={['click']} getPopupContainer={() => dropdownButtonRef.current}>
                <Button type='text' icon={<EllipsisOutlined />} ref={dropdownButtonRef} />
            </Dropdown>
        </div>
    );
};

export default MemberItem;
