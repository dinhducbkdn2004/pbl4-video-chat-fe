import { useState } from 'react';
import { Modal, Input, Upload, Button, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import RoomChatApi from '../../apis/RoomChatApi';
import useFetch from '../../hooks/useFetch';
import uploadApi from '../../apis/uploadApi';

const ChangeDetails = ({ type, chatRoomId, onClose }) => {
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: true, showError: true });
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleOk = async () => {
        const data = { chatRoomId };
        if (name) data.newName = name;
        if (file) {
            setIsUploading(true);
            const uploadResponse = await uploadApi.upload(file, 'chat-room-images');
            data.newImage = uploadResponse.data.secure_url;
            setIsUploading(false);
        }
        await fetchData(() => RoomChatApi.changeDetailChatRoom(data));
        onClose();
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={`Change ${type}`}
                open={true}
                onOk={handleOk}
                onCancel={onClose}
                confirmLoading={isLoading || isUploading}
                okButtonProps={{ disabled: isLoading || isUploading }}
            >
                {type === 'name' || type === 'both' ? (
                    <Input
                        placeholder='Enter new chat room name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                ) : null}
                {type === 'image' || type === 'both' ? (
                    <Upload
                        beforeUpload={(file) => {
                            setFile(file);
                            return false;
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                ) : null}
                {(isLoading || isUploading) && (
                    <div style={{ textAlign: 'center', marginTop: 12 }}>
                        <Spin />
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ChangeDetails;