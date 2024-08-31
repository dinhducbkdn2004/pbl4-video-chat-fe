import { io } from "socket.io-client";
import { authSelector } from "../redux/features/auth/authSelections";
import { store } from "../redux/store";

// Create a socket instance and export it
let socket;

export const initializeSocket = () => {
    const { user, accessToken } = store.getState(authSelector).auth;
    if (!user) return;

    socket = io("http://localhost:3000", {
        query: {
            name: user.name,
            userId: user._id,
            accessToken: accessToken,
        },
    });
    // Listen for connection
    socket.on("connect", () => {
        console.log("Socket connected: ", socket.id);
    });

    // Listen for disconnection
    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
};

export const getSocket = () => {
    return socket;
};
