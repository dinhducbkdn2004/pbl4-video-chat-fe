import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import useFetch from "../../hooks/useFetch";

import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";
import authApi from "../../apis/authApi";

const RegisterForm = () => {
  // const { handleLogin } = useAuth();
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please input your first name!",
                },
              ]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please input your last name!",
                },
              ]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your password!" }]}
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
