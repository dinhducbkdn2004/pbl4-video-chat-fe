import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Space, Card } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
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
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      setIsEmailVerified(true);
      setIsOtpVisible(false);
    } else {
      message.error(data.message);
    }
  };

  const handlePasswordSubmit = async () => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }
    const { isOk, data } = await fetchData(() =>
      authApi.resetPassword(email, password)
    );
    if (isOk) {
      message.success("Password reset successfully!");
      navigate("/login");
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
              {isEmailVerified
                ? "Enter your new password."
                : "Enter your email address to receive a verification code."}
            </Text>
            <Form
              name="forgot-password"
              layout="vertical"
              onFinish={
                isEmailVerified ? handlePasswordSubmit : handleEmailSubmit
              }
              autoComplete="on"
            >
              {!isEmailVerified && (
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
              )}

              {isEmailVerified && (
                <>
                  <Form.Item
                    label="New Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your new password!",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Enter new password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your new password!",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Confirm new password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  className="forgot-password-submit-button"
                >
                  {isEmailVerified ? "Reset Password" : "Submit"}
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
