import { Button, Input } from 'antd';
import { authActions } from '../../redux/features/auth/authSlice';
import userApi from '../../apis/userApi';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import PropTypes from 'prop-types';
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
                <p className='flex min-h-[100px] items-center justify-center text-2xl font-bold'>{input}</p>
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
ChangeIntroduction.propTypes = { introduction: PropTypes.string.isRequired };
export default ChangeIntroduction;
