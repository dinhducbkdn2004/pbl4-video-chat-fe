import { Navigate, Route, Routes } from "react-router-dom";

import ForgotPassword from "./pages/LoginPage/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import MainPage from "./pages/MainPage/MainPage";
import ContactPage from "./pages/MessagePage/ContactPage/ContactPage";
import MessagePage from "./pages/MessagePage/MessagePage";
import SearchPage from "./pages/SearchPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import UnauthorizeRoute from "./routes/UnauthorizeRoute";

function App() {
    return (
        <Routes>
            {/* Public route for unauthenticated users */}
            <Route element={<UnauthorizeRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected route for authenticated users */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainPage />}>
                    <Route path="/message" element={<MessagePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/search" element={<SearchPage />} />
                </Route>
            </Route>

            {/* Optional: Catch-all route for undefined paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
