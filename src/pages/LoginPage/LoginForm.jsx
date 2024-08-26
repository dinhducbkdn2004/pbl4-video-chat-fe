import { Button, Checkbox, Form, Input } from "antd";

import useFetch from "../../hooks/useFetch";

import { useDispatch } from "react-redux";
import { authActions } from "../../redux/features/auth/authSlice";
import authApi from "./../../apis/authApi";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const { isLoading, fetchData, contextHolder } = useFetch();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const { isOk, data } = await fetchData(() => authApi.login(values));

        if (isOk) {
            const { accessToken, refreshToken } = data;
            dispatch(
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
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="on"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Please input your username!",
                        },
                    ]}
                >
                    <Input />
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
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default LoginForm;
