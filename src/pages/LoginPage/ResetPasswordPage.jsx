import React from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import authApi from "../../apis/authApi";
import "./ResetPasswordPage.scss";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { isLoading, fetchData, contextHolder } = useFetch();

  const onFinish = async (values) => {
    const { isOk, data } = await fetchData(() => authApi.resetPassword(values));
    if (isOk) {
      message.success(
        "Password reset successfully. Please log in with your new password."
      );
      navigate("/login");
    } else {
      message.error(data.message);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="reset-password-container">
        <Form
          name="reset-password"
          layout="vertical"
          className="reset-password-form"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your new password"
              className="reset-password-input"
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmNewPassword"
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm your new password"
              className="reset-password-input"
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
              className="reset-password-button"
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ResetPassword;
