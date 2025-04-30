import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Button } from 'antd';
import { InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';
import useFetch from '../../hooks/useFetch';
import authApi from '../../apis/authApi';

const OTPModal = ({ isVisible, email, handleCloseOtpModal, onSuccess }) => {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const { isLoading, fetchData, contextHolder } = useFetch();

    useEffect(() => {
        if (isVisible) {
            document.getElementById('otp-input-0').focus();
        }
    }, [isVisible]);

    const handleOtpChange = (element, index) => {
        const value = element.value;
        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== '' && index < 5) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }

            if (value === '' && index > 0) {
                document.getElementById(`otp-input-${index - 1}`).focus();
            }
        }
    };

    const handleOtpSubmit = async () => {
        const otpCode = otp.join('');
        try {
            const { isOk, data } = await fetchData(() => authApi.checkOtp(email, otpCode));
            if (isOk) {
                localStorage.setItem('verifiedOtp', otpCode);
                onSuccess();
            }
        } catch (error) {
            console.log('OTP verification failed:', error);
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                open={isVisible}
                title={null}
                footer={null}
                centered
                closable={false}
                className='otp-modal'
                width={350}
                styles={{
                    body: {
                        padding: '20px',
                        borderRadius: '8px'
                    }
                }}
            >
                <Button
                    type='text'
                    icon={<CloseOutlined />}
                    onClick={handleCloseOtpModal}
                    className='absolute right-2 top-2'
                    size='small'
                />
                <div className='mb-4 text-center'>
                    <div className='mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50'>
                        <InfoCircleOutlined className='text-xl text-green-500' />
                    </div>
                    <h3 className='text-gray-700 mb-1 text-lg font-medium'>Verify Account</h3>
                    <p className='text-gray-500 text-sm'>
                        Please enter the OTP code sent to email <br />
                        <strong className='text-gray-600 break-all'>{email}</strong>
                    </p>
                </div>
                <div className='mb-4 flex justify-center'>
                    <div className='flex gap-1'>
                        {otp.map((data, index) => (
                            <Input
                                key={index}
                                id={`otp-input-${index}`}
                                value={data}
                                onChange={(e) => handleOtpChange(e.target, index)}
                                maxLength='1'
                                className='text-gray-700 h-10 w-10 rounded-md text-center text-base'
                                style={{ fontWeight: '500' }}
                            />
                        ))}
                    </div>
                </div>
                <Button
                    className='bg-blue-600 hover:bg-blue-700 h-9 w-full rounded-md text-sm font-medium shadow-sm transition-colors'
                    type='primary'
                    onClick={handleOtpSubmit}
                    loading={isLoading}
                >
                    Confirm
                </Button>
            </Modal>
        </>
    );
};

OTPModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    handleCloseOtpModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default OTPModal;
