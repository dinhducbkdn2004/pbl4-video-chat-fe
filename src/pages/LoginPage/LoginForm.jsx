import { Button, Checkbox, Form, Input } from "antd";

import useFetch from "../../hooks/useFetch";

import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import authApi from "../../apis/authApi";

const LoginForm = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const { isLoading, fetchData, contextHolder } = useFetch();
    const onFinish = async (values) => {
        const data = await fetchData(() =>
            authApi.login(values.email, values.password)
        );

        if (data.isOk) {
            localStorage.setItem("ACCESS_TOKEN", data?.data?.accessToken);
            localStorage.setItem("REFRESH_TOKEN", data?.data?.refreshToken);
            handleLogin(data.data);
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
