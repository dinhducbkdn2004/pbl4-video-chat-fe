import { Row, Col } from 'antd';
import AuthTabs from '../../components/Login/AuthTabs';
import asset from '../../assets';

const LoginPage = () => {
    return (
        <Row
            className='h-screen w-full bg-cover bg-no-repeat'
            style={{ backgroundImage: `url(${asset.bg})` }}
            justify='center'
            align='middle'
        >
            <Col
                className='bg-white flex h-4/5 justify-center rounded-lg shadow-lg'
                span={14}
                style={{
                    maxWidth: '100%',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
                }}
            >
                <Col className='h-full overflow-hidden rounded-lg' span={12}>
                    <img
                        className='border-gray-200 h-full w-full rounded-lg object-cover shadow-lg'
                        src={asset.loginpage}
                        alt='Logo'
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
