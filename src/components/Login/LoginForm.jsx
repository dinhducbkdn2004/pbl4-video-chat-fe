import { Button, Checkbox, Form, Input, message } from "antd";
import { LockOutlined, MailOutlined, GoogleOutlined } from "@ant-design/icons";
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
  const [otp, setOtp] = useState(new Array(6).fill(""));
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

  const handleGoogleLogin = async () => {
    const { isOk, data } = await fetchData(() => authApi.googleLogin());

    if (isOk) {
      if (data.requiresOtp) {
        setEmail(data.email);
        setIsOtpVisible(true);
      } else {
        const { accessToken, refreshToken } = data;
        store.dispatch(
          authActions.setCredentials({
            accessToken,
            refreshToken,
          })
        );
        navigate("/");
      }
    }
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
                message: "Please input your email!",
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
              // loading={isLoading}
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
          <Form.Item>
            <GoogleLoginComponent />
          </Form.Item>
          {/* <Form.Item>
            <GoogleLoginComponent />
            <Button
              type="primary"
              danger
              htmlType="submit"
              loading={isLoading}
              style={{
                width: "100%",
                borderRadius: 30,
                padding: "15px 20px",
              }}
            >
              <GoogleOutlined /> Sign In with Google
            </Button>
          </Form.Item> */}
        </Form>
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

export default LoginForm;
