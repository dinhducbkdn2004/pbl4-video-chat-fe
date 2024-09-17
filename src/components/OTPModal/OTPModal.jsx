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
            console.log(data);
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
            <Modal open={isVisible} title={null} footer={null} centered closable={false} className='otp-modal'>
                <Button
                    type='text'
                    icon={<CloseOutlined />}
                    onClick={handleCloseOtpModal}
                    className='absolute right-2.5 top-2.5'
                />
                <div className='mb-5 text-center'>
                    <InfoCircleOutlined className='text-3xl text-green-500' />
                    <h3 className='text-lg font-semibold'>Verify account</h3>
                    <p>
                        Please enter the OTP code sent to email <strong>{email}</strong> to verify your account
                    </p>
                </div>
                <div className='mb-5 flex justify-center'>
                    <div className='flex gap-2'>
                        {otp.map((data, index) => (
                            <Input
                                key={index}
                                id={`otp-input-${index}`}
                                value={data}
                                onChange={(e) => handleOtpChange(e.target, index)}
                                maxLength='1'
                                className='h-12 w-12 text-center'
                            />
                        ))}
                    </div>
                </div>
                <Button className='h-12 w-full' type='primary' onClick={handleOtpSubmit} loading={isLoading}>
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
