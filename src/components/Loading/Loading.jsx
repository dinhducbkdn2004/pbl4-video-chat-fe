import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';
import './Loading.css';

const antIcon = <LoadingOutlined className='custom-spinner' />;

function Loading() {
    return <Spin indicator={antIcon} />;
}

export default Loading;
