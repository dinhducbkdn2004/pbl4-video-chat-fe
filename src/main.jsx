import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import './index.css';
import { store } from './redux/store.js';
import { ConfigProvider, theme } from 'antd';
import { GoogleOAuthProvider } from '@react-oauth/google';
import envClient from './env.js';
import { SocketContextProvider } from './context/SocketContext.jsx';
import React, { useState } from 'react';
import { CallContextProvider } from './context/CallContext.jsx';

function Main() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <BrowserRouter>
            <Provider store={store}>
                <ConfigProvider
                    theme={{
                        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    }}
                >
                    <GoogleOAuthProvider clientId={envClient.GOOGLE_OATH_CLIENT_ID}>
                        <SocketContextProvider>
                            <CallContextProvider>
                                <App setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />
                            </CallContextProvider>
                        </SocketContextProvider>
                    </GoogleOAuthProvider>
                </ConfigProvider>
            </Provider>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);