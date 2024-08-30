import { Row, Col } from "antd";
import AuthTabs from "../../components/Login/AuthTabs";
import "./LoginPage.scss";

const LoginPage = () => {
  // const [activeTab, setActiveTab] = useState("1");

  // const handleTabChange = (key) => {
  //   setActiveTab(key);
  // };

  return (
    <Row className="login-page" justify="center" align="middle">
      <Col
        className="login-page__container"
        span={14}
        style={{
          maxWidth: "100%",
        }}
      >
        <Col className="login-page__image-col" span={12}>
          <img
            className="login-page__image"
            src="./src/assets/logo_2.png"
            alt="Logo"
          />
        </Col>
        <Col span={12}>
          <AuthTabs />
        </Col>
      </Col>
    </Row>
  );
};

export default LoginPage;
