import { Navigate, Route, Routes } from "react-router-dom";

import UnauthorizeRoute from "./routes/UnauthorizeRoute";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainPage from "./pages/MainPage/MainPage";
import MessagePage from "./pages/MessagePage/MessagePage";
import ContactPage from "./pages/ContactPage/ContactPage";

function App() {
  return (
    <Routes>
      {/* Public route for unauthenticated users */}
      <Route element={<UnauthorizeRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected route for authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainPage />}>
          <Route path="/message" element={<MessagePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Route>

      {/* Optional: Catch-all route for undefined paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
