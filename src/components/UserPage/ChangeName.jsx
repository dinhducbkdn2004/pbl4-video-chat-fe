import { Button, Input, notification } from 'antd';
import { authActions } from '../../redux/features/auth/authSlice';
import userApi from '../../apis/userApi';
import { useDispatch } from 'react-redux';
import useFetch from '../../hooks/useFetch';
import { useState } from 'react';
import PropTypes from 'prop-types';

const ChangeName = ({ name }) => {
    const [selectedChange, setSelectedChange] = useState(false);
    const [input, setInput] = useState(name);
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: false, showError: false });
    const dispatch = useDispatch();
    const handleCancel = () => {
        setInput(name);
        setSelectedChange(false);
    };
    const handleUpdate = async () => {
        const data = await fetchData(() => userApi.editProfile({ name: input }));
        if (data.isOk) {
            dispatch(authActions.setProfile(data.data));
            notification.success({
                message: 'Name changed successfully',
                description: 'Your name has been updated',
                showProgress: true
            });
        } else {
            notification.error({
                message: 'Failed to change name',
                description: 'There was an error while changing your name',
                showProgress: true
            });
        }
    };
    return (
        <div>
            {contextHolder}
            <div className='mb-3 flex items-center justify-between'>
                <h1>Edit Name</h1>
                <Button onClick={() => setSelectedChange(true)}>Edit</Button>
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
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleUpdate} loading={isLoading}>
                        Confirm
                    </Button>
                </div>
            )}
        </div>
    );
};
ChangeName.propTypes = { name: PropTypes.string.isRequired };
export default ChangeName;
