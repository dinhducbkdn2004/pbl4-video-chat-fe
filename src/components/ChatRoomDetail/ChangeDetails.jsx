import { useState } from 'react';
import { Modal, Input, Upload, Button, Spin, message, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import RoomChatApi from '../../apis/RoomChatApi';
import useFetch from '../../hooks/useFetch';
import uploadApi from '../../apis/uploadApi';
import ImgCrop from 'antd-img-crop';

const ChangeDetails = ({ type, chatRoomId, onClose, updateChatInfo }) => {
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: false, showError: false });
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
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
        notification.success({
            message: 'Success',
            description: 'Chat room details updated successfully!'
        });
        await updateChatInfo();
        onClose();
    };

    const beforeUpload = async (file) => {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must smaller than 10MB!');
        }
        const isJpgOrPngOrGif = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPngOrGif) {
            message.error('You can only upload JPG/PNG/GIF file!');
        }
        if (isJpgOrPngOrGif && isLt10M) {
            setFile(file);
            return false;
        }
        return Upload.LIST_IGNORE;
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
                    <ImgCrop aspect={820 / 512} showReset quality={1}>
                        <Upload
                            multiple={false}
                            listType='picture-card'
                            fileList={fileList}
                            beforeUpload={beforeUpload}
                            onChange={({ fileList }) => setFileList(fileList.slice(-1))}
                        >
                            {fileList.length === 0 && '+ Upload'}
                        </Upload>
                    </ImgCrop>
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
