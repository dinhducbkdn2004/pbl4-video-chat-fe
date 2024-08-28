import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import useFetch from "../../hooks/useFetch";

import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
import authApi from "../../apis/authApi";

const RegisterForm = () => {
    
    const navigate = useNavigate();
    const { isLoading, fetchData, contextHolder } = useFetch();
    const onFinish = async (values) => {
        const { data, isOk } = await fetchData(() => authApi.register(values));

        if (isOk) {
            navigate("/check-otp", { state: { data } });
        }
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
                    <Input placeholder="Enter your name" />
                </Form.Item>

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
        </>
    );
};

export default RegisterForm;
