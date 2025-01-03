import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';

import ChangeAvatar from './ChangeAvatar';
import ChangeBackgroundImage from './ChangeBackgroundImage';
import ChangeIntroduction from './ChangeIntroduction';
import ChangeName from './ChangeName';

const EditProfile = ({ data }) => {
    const { name, avatar, introduction, backgroundImage } = data;
    const [open, setOpen] = useState(false);

    return (
        <>
            <Modal title='Edit Profile' open={open} footer={null} onCancel={() => setOpen(false)}>
                <div className='flex flex-col gap-y-5'>
                    <ChangeBackgroundImage backgroundImage={backgroundImage} />
                    <ChangeAvatar avatar={avatar} />
                    <ChangeName name={name} />
                    <ChangeIntroduction introduction={introduction} />
                </div>
            </Modal>
            <Button onClick={() => setOpen(true)}>Edit profile</Button>
        </>
    );
};

EditProfile.propTypes = { data: PropTypes.object.isRequired };

export default EditProfile;
