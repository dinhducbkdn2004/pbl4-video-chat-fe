import { Modal, Form, Input, Select, notification } from 'antd';
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import userApi from '../../apis/userApi';
import useFetch from '../../hooks/useFetch';
import { authSelector } from '../../redux/features/auth/authSelections';

const { Option } = Select;

const AddRoomModal = ({ open, onCreate, onCancel }) => {
    const [users, setUsers] = useState([]);
    const { isLoading, fetchData } = useFetch({ showSuccess: false, showError: false });
    const { user } = useSelector(authSelector);

    useEffect(() => {
        if (user?._id) {
            (async () => {
                const data = await fetchData(() => userApi.getFriendList(user._id));
                if (data.isOk) {
                    setUsers(() =>
                        data.data.map((user) => {
                            return {
                                ...user,
                                isFriend: true
                            };
                        })
                    );
                }
            })();
        }
    }, [user?._id]);

    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                form.resetFields();
                onCreate(values);
                // notification.success({
                //     message: 'Success',
                //     description: 'Chat room created successfully!',
                // });
            })
            .catch((info) => {
                notification.error({
                    message: 'Error',
                    description: 'Failed to create chat room. Please try again.'
                });
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            className='add-room-modal'
            open={open}
            title='Create a new chat room'
            okText='Create'
            cancelText='Cancel'
            onCancel={onCancel}
            onOk={handleOk}
        >
            <Form
                className='bg-white-default dark:bg-black-light dark:text-white-default'
                form={form}
                layout='vertical'
                name='form_in_modal'
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item name='roomName' label='Room Name' rules={[{ message: 'Please enter the room name!' }]}>
                    <Input placeholder='Enter room name' />
                </Form.Item>
                <Form.Item
                    name='members'
                    label='Members'
                    rules={[{ required: true, message: 'Please select at least one member!' }]}
                >
                    <Select mode='multiple' placeholder='Select members to add' style={{ width: '100%' }}>
                        {users.map((user) => (
                            <Option key={user._id} value={user._id}>
                                {user.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name='privacy'
                    label='Privacy'
                    rules={[{ required: true, message: 'Please select the privacy!' }]}
                >
                    <Select placeholder='Select privacy'>
                        <Option value='PRIVATE'>Private</Option>
                        <Option value='PUBLIC'>Public</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

AddRoomModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onCreate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AddRoomModal;
