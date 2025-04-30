import { Row, Col } from 'antd';
import AuthTabs from '../../components/Login/AuthTabs';
import asset from '../../assets';

const LoginPage = () => {
    return (
        <Row
            className='h-screen w-full bg-cover bg-no-repeat'
            style={{
                backgroundImage: `url(${asset.bg})`,
                backgroundPosition: 'center'
            }}
            justify='center'
            align='middle'
        >
            <Col
                className='bg-white flex flex-col justify-center overflow-hidden rounded-xl shadow-xl md:flex-row'
                xs={22}
                sm={20}
                md={18}
                lg={16}
                xl={14}
                style={{
                    maxWidth: '1000px',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Col className='hidden overflow-hidden md:block md:h-full' xs={0} sm={0} md={12}>
                    <img
                        className='h-full w-full object-cover'
                        src={asset.loginpage}
                        alt='Logo'
                        style={{ objectPosition: 'center' }}
                    />
                </Col>
                <Col xs={24} md={12} className='flex items-center justify-center px-4 py-8 md:px-6 md:py-10'>
                    <AuthTabs />
                </Col>
            </Col>
        </Row>
    );
};

export default LoginPage;
