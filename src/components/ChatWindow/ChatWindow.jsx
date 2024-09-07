import React from "react";
import { Button } from "antd";

const ChatWindow = () => {
  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <h2>Select Message</h2>
      <p>
        To see your existing conversation or share a link below to start new
      </p>
      <Button type="primary">Add New Message</Button>
    </div>
  );
};

export default ChatWindow;
