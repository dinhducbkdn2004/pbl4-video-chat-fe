import { Button, Checkbox, Form, Input } from "antd";
import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import useFetch from "../../hooks/useFetch";

import { authActions } from "../../redux/features/auth/authSlice";
import authApi from "./../../apis/authApi";
import { useNavigate } from "react-router-dom";
import "./LoginForm.scss";
import { store } from "../../redux/store";

const LoginForm = () => {
    const navigate = useNavigate();
    const { isLoading, fetchData, contextHolder } = useFetch();
    const onFinish = async (values) => {
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

    return (
        <>
            {contextHolder}
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
                        prefix={<UserOutlined />}
                        placeholder="Enter your email"
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

                <Form.Item>
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
                </Form.Item>
            </Form>
        </>
    );
};

export default LoginForm;
