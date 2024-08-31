import { Button, Checkbox, Form, Input, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import useFetch from "../../hooks/useFetch";
import { authActions } from "../../redux/features/auth/authSlice";
import authApi from "../../apis/authApi";
import { useNavigate } from "react-router-dom";
import "./LoginForm.scss";
import { store } from "../../redux/store";
import { useState } from "react";
import OTPModal from "../OTPModal/OTPModal";
import GoogleLoginComponent from "./GoogleLoginComponent";

const LoginForm = () => {
  const navigate = useNavigate();
  const { isLoading, fetchData, contextHolder } = useFetch();
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [email, setEmail] = useState("");

  const onFinish = async (values) => {
    setEmail(values.email);
    const { isOk, data } = await fetchData(() => authApi.login(values));

    if (isOk) {
      const { accessToken, refreshToken } = data;
      store.dispatch(
        authActions.setCredentials({
          accessToken,
          refreshToken,
        })
      );
      navigate("/");
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const handleOtpSuccess = () => {
    setIsOtpVisible(false);
    navigate("/reset-password");
  };

  return (
    <>
      {contextHolder}
      <div className={isOtpVisible ? "dimmed-background" : ""}>
        <Form
          name="login"
          layout="vertical"
          style={{
            maxWidth: 600,
            margin: "0 auto",
          }}
          initialValues={{
            remember: true,
          }}
          requiredMark="optional"
          onFinish={onFinish}
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

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a
              style={{
                float: "right",
              }}
              href=""
              onClick={handleForgotPasswordClick}
            >
              Forgot password?
            </a>
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
              Submit
            </Button>
          </Form.Item>

          <div className="login-form-or">
            <span>Or</span>
          </div>
          <GoogleLoginComponent
            style={{
              width: "100%",
              borderRadius: 30,
              padding: "15px 20px",
            }}
          />
        </Form>
      </div>

      <OTPModal
        isVisible={isOtpVisible}
        email={email}
        handleCloseOtpModal={() => setIsOtpVisible(false)}
        onSuccess={handleOtpSuccess}
      />
    </>
  );
};

export default LoginForm;
