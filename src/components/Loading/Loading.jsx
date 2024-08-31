import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./Loading.scss";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function Loading() {
  return <Spin indicator={antIcon} />;
}

export default Loading;
