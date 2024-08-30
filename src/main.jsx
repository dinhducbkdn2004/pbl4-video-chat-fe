import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "./index.scss";
import { store } from "./redux/store.js";
import { ConfigProvider } from "antd";
import { GoogleOAuthProvider } from "@react-oauth/google";
import envClient from "./env.js";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <ConfigProvider>
                    <GoogleOAuthProvider
                        clientId={envClient.GOOGLE_OATH_CLIENT_ID}
                    >
                        <App />
                    </GoogleOAuthProvider>
                    ;
                </ConfigProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
