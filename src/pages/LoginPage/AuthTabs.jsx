import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import React from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthTabs = () => {
  const items = [
    {
      key: "1",
      label: (
        <span>
          <LoginOutlined style={{ marginRight: "10px" }} />
          Login
        </span>
      ),
      children: <LoginForm />,
    },
    {
      key: "2",
      label: (
        <span>
          <UserAddOutlined style={{ marginRight: "10px" }} />
          Register
        </span>
      ),
      children: <RegisterForm />,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Tabs
        defaultActiveKey="1"
        centered
        items={items}
        style={{
          width: "70%",
          maxWidth: "400px",
          maxHeight: "500px",
        }}
      />
    </div>
  );
};

export default AuthTabs;
