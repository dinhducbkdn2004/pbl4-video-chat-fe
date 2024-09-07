import React, { useEffect } from "react";
import { Layout } from "antd";
import { getSocket } from "../../../configs/socketInstance";
import "./ChatPage.scss";

const { Content } = Layout;

const ChatPage = () => {
    const socket = getSocket();

    useEffect(() => {
        socket.emit("send-message", "aloalo");
    }, [socket]);

    return <div>ChatPage</div>;
};

ChatPage.propTypes = {};

export default ChatPage;
