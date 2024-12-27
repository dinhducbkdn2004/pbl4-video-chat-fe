import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { authActions } from '../../redux/features/auth/authSlice';
import { authSelector } from '../../redux/features/auth/authSelections';
import Slider from 'react-slick'; // Thêm slider package
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const CustomArrow = ({ className, onClick, direction }) => {
    return (
        <button
            className={`${className} ${
                direction === 'up' ? 'top-0' : 'bottom-0'
            } bg-white absolute z-10 translate-x-[-50%] rounded-full p-2`}
            style={{ transform: 'translateX(-50%)' }}
            onClick={onClick}
        >
            {direction === 'up' ? '1' : '▼'}
        </button>
    );
};

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
            <div className='bg-black flex h-svh gap-3'>
                <div className='w-3/4'>
                    <VideoPlayer
                        key={selectedVideo.peerId}
                        peerStream={selectedVideo}
                        onClick={() => handleSelectVideo(selectedVideo)}
                    />
                </div>
                <div className='h-full w-1/4 overflow-hidden'>
                    <Slider {...sliderSettings}>
                        {peerStreams
                            .filter((peerStream) => peerStream.peerId !== selectedVideo.peerId)
                            .map((peerStream, index) => (
                                <div key={peerStream.peerId || index} className='h-1/2 p-2'>
                                    <VideoPlayer
                                        peerStream={peerStream}
                                        onClick={() => handleSelectVideo(peerStream)}
                                    />
                                </div>
                            ))}
                    </Slider>
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
    console.log(peerStream.user._id === currentUser._id);
    return (
        <div onClick={onClick} className='cursor-pointer'>
            <video
                ref={videoRef}
                muted={peerStream.user._id === currentUser._id}
                autoPlay
                playsInline
                className='border-gray-500 h-full w-full rounded-lg border'
            />
            <h6 className='mt-2 text-center text-white-default'>{peerStream.user.name}</h6>
        </div>
    );
};

StreamsGrid.propTypes = {
    peerStreams: PropTypes.arrayOf(PropTypes.object).isRequired // Array of MediaStream objects
};

export default StreamsGrid;
