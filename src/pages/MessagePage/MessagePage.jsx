import React, { useEffect } from "react";
import { Layout } from "antd";
import { getSocket } from "../../configs/socketInstance";
import "./MessagePage.scss";

const { Content } = Layout;

const MessagePage = () => {
  const socket = getSocket();

  useEffect(() => {
    socket.emit("send-message", "aloalo");
  }, [socket]);

  return <div>MessagePage</div>;
};

MessagePage.propTypes = {};

export default MessagePage;
