import { useContext, useState } from "react";

import viteLogo from "/vite.svg";
import "./App.css";
import { AuthContext } from "./context/authContext";

import assets from "./assets/index";
import authService from './services/auth.service';


function App() {
    const [count, setCount] = useState(0);
    const { user, handleLogin: login } = useContext(AuthContext);
    
    const handleLogin = async () => {
        try {
            const data = await authService.login("nguyen123", "123123");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={assets.reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    );
}

export default App;
