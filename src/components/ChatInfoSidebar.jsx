import { Avatar, Button, Collapse, Drawer, Tooltip } from 'antd';
import { BellOutlined, SearchOutlined } from '@ant-design/icons';

const ChatInfoSidebar = ({ open, onClose, roomName, members }) => {
    const collapseData = [
        { key: '1', label: 'Thông tin về đoạn chat', content: 'Thông tin chi tiết về đoạn chat...' },
        { key: '2', label: 'Tùy chỉnh đoạn chat', content: 'Các tùy chỉnh cho đoạn chat...' },
        { key: '3', label: 'Thành viên trong đoạn chat', content: 'Danh sách các thành viên...' },
        { key: '4', label: 'File phương tiện, file và liên kết', content: 'Danh sách file phương tiện và liên kết...' },
        { key: '5', label: 'Quyền riêng tư & hỗ trợ', content: 'Tùy chọn quyền riêng tư và hỗ trợ...' }
    ];

    return (
        <Drawer title={roomName} placement='right' onClose={onClose} open={open} width={400}>
            <div className='flex flex-col items-center'>
                <Avatar.Group size='large' max={{ count: 2 }}>
                    {members?.map((member, index) => (
                        <Tooltip key={index} title={member.name}>
                            <Avatar src={member.avatar} />
                        </Tooltip>
                    ))}
                </Avatar.Group>
                <h3 className='mt-3'>{roomName}</h3>
                <div className='mt-2 flex'>
                    <Button icon={<BellOutlined />} className='mr-2'>
                        Tắt thông báo
                    </Button>
                    <Button icon={<SearchOutlined />}>Tìm kiếm</Button>
                </div>
            </div>

            <Collapse accordion className='mt-4'>
                {collapseData.map((item) => (
                    <Collapse.Panel header={item.label} key={item.key}>
                        <p>{item.content}</p>
                    </Collapse.Panel>
                ))}
            </Collapse>
        </Drawer>
    );
};

export default ChatInfoSidebar;
