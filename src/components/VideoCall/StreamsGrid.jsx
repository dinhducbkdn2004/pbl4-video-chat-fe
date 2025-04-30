import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/features/auth/authSelections';
import { UserOutlined, AudioMutedOutlined, StopOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import './video-call.css'; // We'll create this file for handling forced-colors media queries

const StreamsGrid = ({ peerStreams, currentUserId, isMobile, layout = 'grid' }) => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Thiết lập focus cho khi bố cục là spotlight và chưa có video được chọn
    useEffect(() => {
        if (layout === 'spotlight' && !selectedVideo && peerStreams.length > 1) {
            setSelectedVideo(peerStreams.find((stream) => stream.user._id !== currentUserId) || peerStreams[0]);
        }
    }, [layout, selectedVideo, peerStreams, currentUserId]);

    const handleSelectVideo = (peerStream) => {
        // Trong chế độ spotlight, luôn chọn video đã click
        if (layout === 'spotlight') {
            setSelectedVideo(peerStream);
            return;
        }

        // Trong chế độ grid thông thường, toggle giữa có và không chọn
        if (selectedVideo && selectedVideo.peerId === peerStream.peerId) {
            setSelectedVideo(null);
            return;
        }
        setSelectedVideo(peerStream);
    };

    // Render grid view (mặc định hoặc ít hơn 2 người tham gia)
    if (layout === 'grid' || peerStreams.length <= 2) {
        return (
            <div className='from-gray-900 to-black flex h-full w-full flex-col gap-2 bg-gradient-to-b p-2 md:flex-row'>
                {peerStreams.map((peerStream, index) => (
                    <div
                        key={peerStream.peerId || index}
                        className={`h-full ${peerStreams.length === 1 ? 'w-full' : 'w-full md:w-1/2'}`}
                    >
                        <VideoPlayer
                            peerStream={peerStream}
                            isMuted={peerStream.user._id === currentUserId}
                            onClick={() => handleSelectVideo(peerStream)}
                            isMobile={isMobile}
                            isCurrentUser={peerStream.user._id === currentUserId}
                        />
                    </div>
                ))}
            </div>
        );
    }

    // Render spotlight view (một video lớn, những video khác nhỏ hơn ở dưới)
    if (layout === 'spotlight') {
        const mainVideo = selectedVideo || peerStreams[0];
        const otherVideos = peerStreams.filter((stream) => stream.peerId !== mainVideo.peerId);

        return (
            <div className='from-gray-900 to-black flex h-full w-full flex-col gap-2 bg-gradient-to-b p-2'>
                <div className='h-3/4 w-full'>
                    <VideoPlayer
                        key={mainVideo.peerId}
                        peerStream={mainVideo}
                        isMuted={mainVideo.user._id === currentUserId}
                        onClick={() => handleSelectVideo(mainVideo)}
                        isMobile={isMobile}
                        isCurrentUser={mainVideo.user._id === currentUserId}
                        isFocused={true}
                    />
                </div>
                <div className='flex h-1/4 gap-2 overflow-x-auto overflow-y-hidden'>
                    {otherVideos.map((peerStream, index) => (
                        <div key={peerStream.peerId || index} className='aspect-video h-full'>
                            <VideoPlayer
                                peerStream={peerStream}
                                isMuted={peerStream.user._id === currentUserId}
                                onClick={() => handleSelectVideo(peerStream)}
                                isMobile={isMobile}
                                isSmall={true}
                                isCurrentUser={peerStream.user._id === currentUserId}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Render sidebar view (một video lớn bên trái, danh sách video nhỏ bên phải)
    if (layout === 'sidebar') {
        const mainVideo = selectedVideo || peerStreams[0];
        const otherVideos = peerStreams.filter((stream) => stream.peerId !== mainVideo.peerId);

        return (
            <div className='from-gray-900 to-black flex h-full w-full gap-2 bg-gradient-to-b p-2'>
                <div className='h-full w-full md:w-3/4'>
                    <VideoPlayer
                        key={mainVideo.peerId}
                        peerStream={mainVideo}
                        isMuted={mainVideo.user._id === currentUserId}
                        onClick={() => handleSelectVideo(mainVideo)}
                        isMobile={isMobile}
                        isCurrentUser={mainVideo.user._id === currentUserId}
                        isFocused={true}
                    />
                </div>
                <div className='hidden h-full w-1/4 flex-col gap-2 overflow-y-auto md:flex'>
                    {otherVideos.map((peerStream, index) => (
                        <div key={peerStream.peerId || index} className='h-1/3 w-full'>
                            <VideoPlayer
                                peerStream={peerStream}
                                isMuted={peerStream.user._id === currentUserId}
                                onClick={() => handleSelectVideo(peerStream)}
                                isMobile={isMobile}
                                isSmall={true}
                                isCurrentUser={peerStream.user._id === currentUserId}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Fallback cho layout không xác định - sử dụng grid view
    return (
        <div className='from-gray-900 to-black grid h-full w-full grid-cols-1 gap-2 bg-gradient-to-b p-2 sm:grid-cols-2'>
            {peerStreams.map((peerStream, index) => (
                <VideoPlayer
                    key={peerStream.peerId || index}
                    peerStream={peerStream}
                    isMuted={peerStream.user._id === currentUserId}
                    onClick={() => handleSelectVideo(peerStream)}
                    isMobile={isMobile}
                    isCurrentUser={peerStream.user._id === currentUserId}
                />
            ))}
        </div>
    );
};

const VideoPlayer = ({ peerStream, onClick, isMuted, isMobile, isSmall, isCurrentUser = false, isFocused = false }) => {
    const videoRef = useRef(null);
    const [hasVideo, setHasVideo] = useState(true);
    const [isMutedVideo, setIsMutedVideo] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = peerStream.stream;

            // Kiểm tra trạng thái track video
            const videoTrack = peerStream.stream.getVideoTracks()[0];
            if (videoTrack) {
                setHasVideo(videoTrack.enabled);

                // Lắng nghe sự kiện muted/unmuted của video track
                const trackListener = () => {
                    setHasVideo(videoTrack.enabled);
                };

                videoTrack.addEventListener('mute', () => setHasVideo(false));
                videoTrack.addEventListener('unmute', () => setHasVideo(true));

                return () => {
                    videoTrack.removeEventListener('mute', trackListener);
                    videoTrack.removeEventListener('unmute', trackListener);
                };
            } else {
                setHasVideo(false);
            }
        }
    }, [peerStream]);

    // Kiểm tra audio track có bị tắt không
    useEffect(() => {
        const audioTrack = peerStream.stream.getAudioTracks()[0];
        if (audioTrack) {
            setIsMutedVideo(!audioTrack.enabled);

            // Lắng nghe sự kiện muted/unmuted của audio track
            const trackListener = () => {
                setIsMutedVideo(!audioTrack.enabled);
            };

            audioTrack.addEventListener('mute', trackListener);
            audioTrack.addEventListener('unmute', trackListener);

            return () => {
                audioTrack.removeEventListener('mute', trackListener);
                audioTrack.removeEventListener('unmute', trackListener);
            };
        }
    }, [peerStream]);

    return (
        <div
            onClick={onClick}
            className={`relative h-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300 ${isSmall ? 'border-gray-700 border' : ''} ${isFocused ? 'ring-blue-500 shadow-lg ring-2' : ''}`}
        >
            {/* Video element */}
            <video
                ref={videoRef}
                muted={isMuted}
                autoPlay
                playsInline
                className={`h-full w-full object-cover transition-all duration-300 ${!hasVideo ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Placeholder khi không có video */}
            {!hasVideo && (
                <div className='bg-gray-800 absolute inset-0 flex items-center justify-center'>
                    <Avatar size={isSmall ? 64 : 120} icon={<UserOutlined />} className='bg-gray-600'>
                        {peerStream.user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                </div>
            )}

            {/* Chỉ báo trạng thái (muted, no video) */}
            <div className='absolute right-2 top-2 flex gap-1'>
                {isMutedVideo && (
                    <div className='rounded-full bg-red-500/70 p-1'>
                        <AudioMutedOutlined className='text-white' />
                    </div>
                )}
                {!hasVideo && (
                    <div className='rounded-full bg-red-500/70 p-1'>
                        <StopOutlined className='text-white' />
                    </div>
                )}
            </div>

            {/* User info banner */}
            <div className='from-black/70 absolute bottom-0 left-0 right-0 bg-gradient-to-t to-transparent p-2'>
                <h6 className={`text-white truncate font-medium ${isSmall || isMobile ? 'text-xs' : 'text-sm'}`}>
                    {peerStream.user.name} {isCurrentUser ? '(You)' : ''}
                </h6>
            </div>
        </div>
    );
};

StreamsGrid.propTypes = {
    peerStreams: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentUserId: PropTypes.string.isRequired,
    isMobile: PropTypes.bool,
    layout: PropTypes.oneOf(['grid', 'spotlight', 'sidebar'])
};

StreamsGrid.defaultProps = {
    isMobile: false,
    layout: 'grid'
};

VideoPlayer.propTypes = {
    peerStream: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    isMuted: PropTypes.bool,
    isMobile: PropTypes.bool,
    isSmall: PropTypes.bool,
    isCurrentUser: PropTypes.bool,
    isFocused: PropTypes.bool
};

VideoPlayer.defaultProps = {
    isMuted: false,
    isMobile: false,
    isSmall: false,
    isCurrentUser: false,
    isFocused: false,
    onClick: () => {}
};

export default StreamsGrid;
