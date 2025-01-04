import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { authActions } from '../../redux/features/auth/authSlice';
import { authSelector } from '../../redux/features/auth/authSelections';
import Slider from 'react-slick'; // Thêm slider package
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const sliderSettings = {
    infinite: false,
    dots: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    draggable: true,
    swipe: true,
    swipeToSwipe: true
};
const StreamsGrid = ({ peerStreams }) => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const handleSelectVideo = (peerStream) => {
        if (selectedVideo && selectedVideo.peerId === peerStream.peerId) {
            setSelectedVideo(null);
            return;
        }
        setSelectedVideo(peerStream);
    };
    if (selectedVideo)
        return (
            <div className='bg-black flex gap-3'>
                <div className='w-3/4'>
                    <VideoPlayer
                        key={selectedVideo.peerId}
                        peerStream={selectedVideo}
                        onClick={() => handleSelectVideo(selectedVideo)}
                    />
                </div>
                <div className='h-full w-1/4 overflow-hidden'>
                    <div className='flex-col gap-3'>
                        {peerStreams
                            .filter((peerStream) => peerStream.peerId !== selectedVideo.peerId)
                            .slice(0, 2)
                            .map((peerStream, index) => (
                                <div key={peerStream.peerId || index} className='h-auto w-full'>
                                    <VideoPlayer
                                        peerStream={peerStream}
                                        onClick={() => handleSelectVideo(peerStream)}
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    return (
        <div className='bg-black grid grid-cols-1 gap-4 rounded-lg p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {peerStreams.map((peerStream, index) => (
                <VideoPlayer
                    key={peerStreams.peerId || index}
                    peerStream={peerStream}
                    onClick={() => handleSelectVideo(peerStream)}
                />
            ))}
        </div>
    );
};

const VideoPlayer = ({ peerStream, onClick }) => {
    const { user: currentUser } = useSelector(authSelector);
    const videoRef = useRef(null);

    useEffect(() => {
        console.log(peerStream);
        if (videoRef.current) {
            videoRef.current.srcObject = peerStream.stream; // Gắn stream vào video element
        }
    }, [peerStream]);

    return (
        <div onClick={onClick} className='cursor-pointer'>
            <video
                ref={videoRef}
                muted={peerStream.user._id === currentUser._id}
                autoPlay
                playsInline
                className='border-gray-500 h-full w-full rounded-lg'
            />
            <h6 className='mt-2 text-center text-white-default'>{peerStream.user.name}</h6>
        </div>
    );
};

StreamsGrid.propTypes = {
    peerStreams: PropTypes.arrayOf(PropTypes.object).isRequired // Array of MediaStream objects
};

export default StreamsGrid;
