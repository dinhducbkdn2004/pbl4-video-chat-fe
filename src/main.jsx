import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "./index.scss";
import { store } from "./redux/store.js";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
