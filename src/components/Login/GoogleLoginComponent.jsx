import { GoogleLogin } from "@react-oauth/google";
import { authActions } from "../../redux/features/auth/authSlice";
import authApi from "../../apis/authApi";
import { store } from "../../redux/store";
import { useNavigate } from "react-router-dom";

const GoogleLoginComponent = () => {
    const navigate = useNavigate();
    const onLoginGoogleSuccess = async (res) => {
        const { data, isOk } = await authApi.loginByGoogle(res.credential);
        if (isOk) {
            const { accessToken, refreshToken } = data;
            store.dispatch(
                authActions.setCredentials({ accessToken, refreshToken })
            );
            navigate("/");
        }
    };
    const onLoginGoogleFailure = async (res) => {
        console.log(res);
    };
    return (
        <GoogleLogin
            onSuccess={onLoginGoogleSuccess}
            onError={onLoginGoogleFailure}
            style={{
                width: "100%",
                borderRadius: 30,
                padding: "15px 20px",
            }}
        />
    );
};

export default GoogleLoginComponent;
