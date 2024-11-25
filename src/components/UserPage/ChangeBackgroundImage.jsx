import { useDispatch } from 'react-redux';
import userApi from '../../apis/userApi';
import { authActions } from '../../redux/features/auth/authSlice';
import { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import uploadApi from '../../apis/uploadApi';
import { Button, Upload, Image as ImageAnt, message } from 'antd';
import PropTypes from 'prop-types';

import Loading from '../Loading/Loading';
import ImgCrop from 'antd-img-crop';

const ChangeBackgroundImage = ({ backgroundImage }) => {
    const [isChangingAvatar, setIsChangingAvatar] = useState(false);
    const [fileList, setFileList] = useState([]);
    const { fetchData, isLoading, contextHolder } = useFetch();
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
        }
    };

    return (
        <div>
            {contextHolder}

            <div className='flex items-center justify-between mb-2'>
                <h1>Chỉnh sửa ảnh bìa</h1>

                <Button
                    onClick={() => {
                        isChangingAvatar ? setIsChangingAvatar(false) : setIsChangingAvatar(true);
                    }}
                >
                    {isChangingAvatar ? 'Hủy' : 'Thay đổi'}
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
                            <Loading />
                        ) : (
                            <Upload
                                multiple={false}
                                listType='picture-card'
                                fileList={fileList}
                                beforeUpload={async (file) => {
                                    const isLt10M = file.size / 1024 / 1024 < 10;

                                    if (!isLt10M) {
                                        message.error('Image must smaller than 10MB!');
                                    }
                                    const isJpgOrPngOrGif =
                                        file.type === 'image/jpeg' ||
                                        file.type === 'image/png' ||
                                        file.type === 'image/gif';
                                    if (!isJpgOrPngOrGif) {
                                        message.error('You can only upload JPG/PNG/GIF file!');
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
