import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const StreamsGrid = ({ peerStreams }) => {
    return (
        <div className='bg-black grid grid-cols-1 gap-4 rounded-lg p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {peerStreams.map((peerStreams, index) => (
                <VideoPlayer key={peerStreams.peerId || index} stream={peerStreams.stream} />
            ))}
        </div>
    );
};

const VideoPlayer = ({ stream }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream; // Gắn stream vào video element
        }
    }, [stream]);

    return <video ref={videoRef} autoPlay playsInline muted className='border-gray-500 rounded-lg border' />;
};

StreamsGrid.propTypes = {
    peerStreams: PropTypes.arrayOf(PropTypes.object).isRequired // Array of MediaStream objects
};

export default StreamsGrid;
