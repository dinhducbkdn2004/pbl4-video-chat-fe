import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import Container from './Container';

const VideoCall = () => {
    const { chatRoomId } = useParams();
    const currentStream = useRef(null);
    useEffect(() => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            currentStream.current.srcObject = stream;
        })();
    }, []);

    return (
        <div className='flex h-lvh flex-col justify-between overflow-auto bg-black-default px-10 pt-10'>
            <div className='flex flex-1 flex-wrap justify-center gap-4'>
                <video className='h-auto w-1/3 rounded-xl' muted ref={currentStream} autoPlay playsInline />
                <video className='h-auto w-1/3 rounded-xl' muted ref={currentStream} autoPlay playsInline />
            </div>
            <div className='flex items-center justify-center gap-4 p-10'>
                <Button />
                <Button />
                <Button />
                <Button />
                <Button />
            </div>
        </div>
    );
};

VideoCall.propTypes = {};

export default VideoCall;
