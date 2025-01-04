import { useDispatch } from 'react-redux';
import userApi from '../../apis/userApi';
import { authActions } from '../../redux/features/auth/authSlice';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import uploadApi from '../../apis/uploadApi';
import { Button, Upload, Spin, Image as ImageAnt, notification, message } from 'antd';
import PropTypes from 'prop-types';
import ImgCrop from 'antd-img-crop';

const ChangeBackgroundImage = ({ backgroundImage }) => {
    const [isChangingAvatar, setIsChangingAvatar] = useState(false);
    const [fileList, setFileList] = useState([]);
    const { fetchData, isLoading, contextHolder } = useFetch({ showSuccess: false, showError: false });
    const dispatch = useDispatch();

    const onUpload = async (file) => {
        const { data, isOk } = await fetchData(async () => {
            const { data, status } = await uploadApi.upload(file, 'backgroundImage');

            if (status === 200) {
                const res = await userApi.editProfile({ backgroundImage: data.secure_url });
                return res;
            }
        });

        if (isOk) {
            dispatch(authActions.setProfile(data));
            notification.success({
                message: 'Background image changed successfully',
                description: 'Your background image has been updated',
                showProgress: true
            });
        } else {
            notification.error({
                message: 'Failed to change background image',
                description: 'There was an error while changing your background image',
                showProgress: true
            });
        }
    };

    return (
        <div>
            {contextHolder}

            <div className='mb-2 flex items-center justify-between'>
                <h1>Edit Background Image</h1>

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
                        aspect={820 / 512}
                        showReset
                        quality={1}
                        onModalCancel={() => {
                            setIsChangingAvatar(() => false);
                            setFileList(() => []);
                        }}
                        beforeCrop={async (file) => {
                            const isLt10M = file.size / 1024 / 1024 < 10;

                            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

                            return isLt10M && isJpgOrPng;
                        }}
                    >
                        {isLoading ? (
                            <Spin />
                        ) : (
                            <Upload
                                multiple={false}
                                listType='picture-card'
                                fileList={fileList}
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
                                {fileList.length === 0 && '+ Upload'}
                            </Upload>
                        )}
                    </ImgCrop>
                ) : (
                    <ImageAnt src={backgroundImage} />
                )}
            </div>
        </div>
    );
};
ChangeBackgroundImage.propTypes = { backgroundImage: PropTypes.string.isRequired };
export default ChangeBackgroundImage;
