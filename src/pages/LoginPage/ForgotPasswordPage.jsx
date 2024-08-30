import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Space, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import authApi from "../../apis/authApi";
import OTPModal from "../../components/OTPModal/OTPModal";
import "./ForgotPasswordPage.scss";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isLoading, fetchData, contextHolder } = useFetch();
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async (values) => {
    setEmail(values.email);
    const { isOk, data } = await fetchData(() =>
      authApi.checkEmail(values.email)
    );
    if (isOk) {
      setIsOtpVisible(true);
    } else {
      message.error(data.message);
    }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    const { isOk, data } = await fetchData(() =>
      authApi.verifyOtp(email, otpCode)
    );
    if (isOk) {
      navigate("/reset-password");
    } else {
      message.error(data.message);
    }
  };

  const handleCloseOtpModal = () => {
    setIsOtpVisible(false);
  };

  return (
    <>
      {contextHolder}
      <div className="forgot-password-container">
        <Card className="forgot-password-card">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Title level={2} style={{ textAlign: "center" }}>
              Forgot Password
            </Title>
            <Text
              className="forgot-password-description"
              type="secondary"
              style={{ textAlign: "center" }}
            >
              Enter your email address to receive a verification code.
            </Text>
            <Form
              name="forgot-password"
              layout="vertical"
              onFinish={handleEmailSubmit}
              autoComplete="on"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input a valid email!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  className="forgot-password-submit-button"
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </div>

      <OTPModal
        isVisible={isOtpVisible}
        email={email}
        otp={otp}
        setOtp={setOtp}
        handleOtpSubmit={handleOtpSubmit}
        handleCloseOtpModal={handleCloseOtpModal}
      />
    </>
  );
};

export default ForgotPassword;
