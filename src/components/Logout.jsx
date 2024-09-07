import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../redux/features/auth/authSlice";

export const handleLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return () => {
    dispatch(authActions.logout());
    navigate("/login");
  };
};

export default handleLogout;
