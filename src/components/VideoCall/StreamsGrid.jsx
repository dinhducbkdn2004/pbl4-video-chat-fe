import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { authActions } from '../../redux/features/auth/authSlice';
import { authSelector } from '../../redux/features/auth/authSelections';

const StreamsGrid = ({ peerStreams }) => {
    return (
        <div className='bg-black grid grid-cols-1 gap-4 rounded-lg p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {peerStreams.map((peerStream, index) => (
                <VideoPlayer key={peerStreams.peerId || index} peerStream={peerStream} />
            ))}
        </div>
    );
};

const VideoPlayer = ({ peerStream }) => {
    const { user: currentUser } = useSelector(authSelector);
    const videoRef = useRef(null);
    //console.log(currentUser._id === peerStream.user._id);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = peerStream.stream; // Gắn stream vào video element
        }
    }, [peerStream]);

    return (
        <div>
            <video ref={videoRef} autoPlay playsInline className='border-gray-500 rounded-lg border' />
            <h6 className='mt-2 text-center text-white-default'>{peerStream.user.name}</h6>
        </div>
    );
};

StreamsGrid.propTypes = {
    peerStreams: PropTypes.arrayOf(PropTypes.object).isRequired // Array of MediaStream objects
};

export default StreamsGrid;
