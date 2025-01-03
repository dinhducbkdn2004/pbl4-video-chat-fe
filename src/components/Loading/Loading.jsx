import { Spin } from 'antd';
import './Loading.css';

function Loading() {
    return (
        <>
            <div className='flex h-screen items-center justify-center bg-white-dark dark:bg-black-default'>
                <div className='loader-container'>
                    <div className='loader'></div>
                    <div className='loader-text'>Loading...</div>
                </div>
            </div>
        </>
    );
}

export default Loading;
