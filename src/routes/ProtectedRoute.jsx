import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { authSelector } from "../redux/features/auth/authSelections";

const ProtectedRoute = () => {
    const authState = useSelector(authSelector);

    if (authState.isAuthenticated) return <Outlet />;
    return <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;
