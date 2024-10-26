import React, { createContext, useState, useContext } from 'react';

const ChatRoomContext = createContext();

export const useChatRoom = () => useContext(ChatRoomContext);

export const ChatRoomProvider = ({ children }) => {
    const [chatRoomDetails, setChatRoomDetails] = useState({});

    const updateChatRoomDetails = (details) => {
        setChatRoomDetails(details);
    };

    return (
        <ChatRoomContext.Provider value={{ chatRoomDetails, updateChatRoomDetails }}>
            {children}
        </ChatRoomContext.Provider>
    );
};
