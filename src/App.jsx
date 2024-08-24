import { Route, Routes } from "react-router-dom";

import UnauthorizeRoute from "./components/UnauthorizeRoute";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainPage from "./pages/MainPage/MainPage";

function App() {
    return (
        <Routes>
            {/* Public route khi người dùng chưa đăng nhập sẽ thêm ở đây!!! 
            
            
            */}
            <Route element={<UnauthorizeRoute />}>
                <Route path="/login" element=<LoginPage /> />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/" element=<MainPage /> />
            </Route>
        </Routes>
    );
}

export default App;
