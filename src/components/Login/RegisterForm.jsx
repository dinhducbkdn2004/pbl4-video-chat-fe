import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import authApi from "../../apis/authApi";
import OTPModal from "../OTPModal/OTPModal";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { isLoading, fetchData, contextHolder } = useFetch();
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");

  const onFinish = async (values) => {
    setEmail(values.email);
    const { data, isOk } = await fetchData(() =>
      authApi.checkEmail(values.email)
    );

    if (isOk) {
      const { data, isOk } = await fetchData(() => authApi.register(values));
      if (isOk) {
        setIsOtpVisible(true);
      }
    }
    // else {
    //   message.error("Email is invalid or already exists. Please try again.");
    // }
  };

  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    const { data, isOk } = await fetchData(() =>
      authApi.verifyOtp(email, otpCode)
    );
    if (isOk) {
      navigate("/reset-password");
    } else {
      message.error("Invalid OTP. Please try again.");
    }
  };

  const handleCloseOtpModal = () => {
    setIsOtpVisible(false);
  };

  return (
    <>
      {contextHolder}
      <Form
        name="register"
        layout="vertical"
        style={{
          maxWidth: 600,
          margin: "0 auto",
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="on"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
        </Form.Item>

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
          <Input prefix={<MailOutlined />} placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Repeat password"
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{
              width: "100%",
              borderRadius: 30,
              padding: "15px 20px",
            }}
          >
            Register
          </Button>
        </Form.Item>
      </Form>

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

export default RegisterForm;
