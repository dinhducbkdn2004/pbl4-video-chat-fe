import { useSelector } from 'react-redux';
import { authSelector } from '../redux/features/auth/authSelections';
import { useState } from 'react';

const VideoGrid = ({ localStream, calleePeers }) => {
    const { user: currentUser } = useSelector(authSelector);
    const [selectedStream, setSelectedStream] = useState(null);

    const handleVideoClick = (stream) => {
        setSelectedStream(stream === selectedStream ? null : stream);
    };
    console.log(selectedStream);
    const renderStream = (stream, label) => (
        <div className='w-1/4 p-3' onClick={() => handleVideoClick(stream)}>
            <video
                ref={(el) => {
                    if (el) {
                        el.srcObject = stream;
                    }
                }}
                autoPlay
                className='h-auto w-full cursor-pointer'
                muted={stream.id === localStream.id}
            />
            <div className='mt-3 text-center text-white-default'>{label}</div>
        </div>
    );

    return (
        <div className='h-lvh w-full overflow-hidden'>
            {selectedStream ? (
                <div className='flex flex-row'>
                    <div className='max-w-[1440px] flex-1 p-3' onClick={() => handleVideoClick(selectedStream)}>
                        <video
                            ref={(el) => {
                                if (el) {
                                    el.srcObject = selectedStream;
                                }
                            }}
                            autoPlay
                            className='h-auto w-full cursor-pointer object-cover'
                            muted={selectedStream.id === localStream.id}
                        />
                    </div>
                    <div className='flex flex-col'>
                        {[localStream, ...calleePeers]
                            .filter((peer) => selectedStream.id !== peer.id)
                            .map((peer, index) => renderStream(peer, index))}
                    </div>
                </div>
            ) : (
                <div className='flex flex-row flex-wrap items-center justify-center'>
                    {localStream && renderStream(localStream, currentUser?.name)}
                    {calleePeers.map((peer, index) => renderStream(peer, `Caller ${index + 1}`))}
                </div>
            )}
        </div>
    );
};

export default VideoGrid;
