import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Image, Input, message, Modal, Upload } from 'antd';
import uploadApi from '../../apis/uploadApi';
import useFetch from './../../hooks/useFetch';
import userApi from './../../apis/userApi';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/features/auth/authSlice';
const props = {
    beforeUpload: async (file) => {
        const isPNG = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
        if (!isPNG) {
            message.error(`${file.name} is not a png/jpg/jpeg file`);
        }

        await uploadApi.upload(file, file.uid, 'avatar');
        return isPNG || Upload.LIST_IGNORE;
    },
    maxCount: 1
};
const EditProfile = ({ data }) => {
    const { name, avatar, introduction, backgroundImage } = data;
    const [open, setOpen] = useState(false);

    return (
        <>
            <Modal title='Chỉnh sửa trang cá nhân' open={open} footer={null} onCancel={() => setOpen(false)}>
                <div className='flex flex-col gap-y-5'>
                    <ChangeName name={name} />
                    <ChangeIntroduction introduction={introduction} />
                </div>
            </Modal>
            <Button onClick={() => setOpen(true)}>Edit profile</Button>
        </>
    );
};
const ChangeName = ({ name }) => {
    const [selectedChange, setSelectedChange] = useState(false);
    const [input, setInput] = useState(name);
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: true, showError: true });
    const dispatch = useDispatch();
    const handleCancel = () => {
        setInput(name);
        setSelectedChange(false);
    };
    const handleUpdate = async () => {
        const data = await fetchData(() => userApi.editProfile({ name: input }));
        if (data.isOk) {
            dispatch(authActions.setProfile(data.data));
        }
    };
    return (
        <div>
            {contextHolder}
            <div className='mb-3 flex items-center justify-between'>
                <h1>Chỉnh sửa tên</h1>
                <Button onClick={() => setSelectedChange(true)}>Chỉnh sửa</Button>
            </div>
            {selectedChange ? (
                <Input
                    value={input}
                    disabled={!selectedChange}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                />
            ) : (
                <p>{input}</p>
            )}
            {selectedChange && (
                <div className='mt-2 flex justify-end gap-x-2'>
                    <Button onClick={handleCancel}>Hủy</Button>
                    <Button onClick={handleUpdate} loading={isLoading}>
                        Xác nhận
                    </Button>
                </div>
            )}
        </div>
    );
};
const ChangeIntroduction = ({ introduction }) => {
    const [selectedChange, setSelectedChange] = useState(false);
    const [input, setInput] = useState(introduction);
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: true, showError: true });
    const dispatch = useDispatch();
    const handleCancel = () => {
        setInput(introduction);
        setSelectedChange(false);
    };
    const handleUpdate = async () => {
        const data = await fetchData(() => userApi.editProfile({ introduction: input }));
        if (data.isOk) {
            dispatch(authActions.setProfile(data.data));
        }
    };
    return (
        <div>
            {contextHolder}
            <div className='mb-3 flex items-center justify-between'>
                <h1>Chỉnh sửa tiểu sử</h1>
                <Button onClick={() => setSelectedChange(true)}>Chỉnh sửa</Button>
            </div>
            {selectedChange ? (
                <Input
                    value={input}
                    disabled={!selectedChange}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                />
            ) : (
                <p>{input}</p>
            )}

            {selectedChange && (
                <div className='mt-2 flex justify-end gap-x-2'>
                    <Button onClick={handleCancel}>Hủy</Button>
                    <Button onClick={handleUpdate} loading={isLoading}>
                        Xác nhận
                    </Button>
                </div>
            )}
        </div>
    );
};
EditProfile.propTypes = { data: PropTypes.object.isRequired };

export default EditProfile;
