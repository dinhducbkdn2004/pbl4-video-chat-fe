import { useDispatch } from 'react-redux';
import userApi from '../../apis/userApi';
import { authActions } from '../../redux/features/auth/authSlice';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import uploadApi from '../../apis/uploadApi';
import { Button, Upload, Spin, Image as ImageAnt, message } from 'antd';
import PropTypes from 'prop-types';
import ImgCrop from 'antd-img-crop';

const ChangeAvatar = ({ avatar }) => {
    const [isChangingAvatar, setIsChangingAvatar] = useState(false);
    const [file, setFile] = useState([]);
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: false, showError: false });
    const dispatch = useDispatch();

    const onUpload = async (file) => {
        const { data, isOk } = await fetchData(async () => {
            const { data, status } = await uploadApi.upload(file, 'avatar');
            if (status === 200) {
                const res = await userApi.editProfile({ avatar: data.secure_url });
                return res;
            }
        });

        if (isOk) {
            dispatch(authActions.setProfile(data));
        }
    };

    return (
        <div>
            {contextHolder}
            <div className='flex items-center justify-between'>
                <h1>Edit Avatar</h1>
                <Button
                    onClick={() => {
                        isChangingAvatar ? setIsChangingAvatar(false) : setIsChangingAvatar(true);
                    }}
                >
                    {isChangingAvatar ? 'Cancel' : 'Change'}
                </Button>
            </div>
            <div className='flex min-h-[200px] items-center justify-center'>
                {isChangingAvatar ? (
                    <ImgCrop
                        showReset
                        quality={1}
                        onModalCancel={() => {
                            setIsChangingAvatar(() => false);
                            setFile(() => []);
                        }}
                        beforeCrop={async (file) => {
                            const isLt10M = file.size / 1024 / 1024 < 10;

                            const isJpgOrPngOrGif = file.type === 'image/jpeg' || file.type === 'image/png';

                            return isLt10M && isJpgOrPngOrGif;
                        }}
                    >
                        {isLoading ? (
                            <Spin />
                        ) : (
                            <Upload
                                multiple={false}
                                listType='picture-card'
                                fileList={file}
                                disabled={isLoading}
                                beforeUpload={async (file) => {
                                    const isLt10M = file.size / 1024 / 1024 < 10;
                                    if (!isLt10M) {
                                        message.error('Image must be smaller than 10MB!');
                                    }
                                    const isJpgOrPngOrGif =
                                        file.type === 'image/jpeg' ||
                                        file.type === 'image/png' ||
                                        file.type === 'image/gif';
                                    if (!isJpgOrPngOrGif) {
                                        message.error('You can only upload JPG/PNG/GIF files!');
                                    }

                                    if (isJpgOrPngOrGif && isLt10M) await onUpload(file);
                                    return false;
                                }}
                            >
                                {file.length === 0 && '+ Upload'}
                            </Upload>
                        )}
                    </ImgCrop>
                ) : (
                    <ImageAnt src={avatar} />
                )}
            </div>
        </div>
    );
};
ChangeAvatar.propTypes = { avatar: PropTypes.string.isRequired };
export default ChangeAvatar;
