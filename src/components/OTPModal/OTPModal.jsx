import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Input, Button, message } from "antd";
import { InfoCircleOutlined, CloseOutlined } from "@ant-design/icons";
import useFetch from "../../hooks/useFetch";
import authApi from "../../apis/authApi";

const OTPModal = ({ isVisible, email, handleCloseOtpModal, onSuccess }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const { fetchData } = useFetch();

  useEffect(() => {
    if (isVisible) {
      document.getElementById("otp-input-0").focus();
    }
  }, [isVisible]);

  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }

      if (value === "" && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    const { isOk, data } = await fetchData(() =>
      authApi.verifyOtp(email, otpCode)
    );
    if (isOk) {
      message.success("OTP verified successfully!");
      onSuccess();
    } else {
      message.error(data.message);
    }
  };

  return (
    <Modal
      open={isVisible}
      title={null}
      footer={null}
      centered
      closable={false}
      className="otp-modal"
    >
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={handleCloseOtpModal}
        style={{ position: "absolute", top: "10px", right: "10px" }}
      />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <InfoCircleOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
        <h3>Verify account</h3>
        <p>
          Please enter the OTP code sent to email <strong>{email}</strong> to
          verify your account
        </p>
      </div>
      <div className="otp-inputs">
        {otp.map((data, index) => (
          <Input
            key={index}
            id={`otp-input-${index}`}
            value={data}
            onChange={(e) => handleOtpChange(e.target, index)}
            maxLength="1"
            style={{
              width: "50px",
              height: "50px",
              textAlign: "center",
              marginRight: "8px",
            }}
          />
        ))}
      </div>
      <Button
        className="otp-submit"
        type="primary"
        block
        size="large"
        onClick={handleOtpSubmit}
      >
        Confirm
      </Button>
    </Modal>
  );
};

OTPModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  handleCloseOtpModal: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default OTPModal;
