import { useState } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '../redux/features/auth/authSelections';

const VideoGrid = ({ localStream, calleePeers }) => {
    const { user: currentUser } = useSelector(authSelector);
    const [selectedStream, setSelectedStream] = useState(null);

    const handleVideoClick = (stream) => {
        setSelectedStream(stream === selectedStream ? null : stream);
    };

    const renderStream = (streamObj, label) => (
        <div key={streamObj.stream.id} className='w-1/4 p-3' onClick={() => handleVideoClick(streamObj.stream)}>
            <video
                ref={(el) => {
                    if (el) {
                        el.srcObject = streamObj.stream;
                    }
                }}
                autoPlay
                className='h-auto w-full cursor-pointer'
                muted={streamObj.stream.id === localStream.id}
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
                        {[{ stream: localStream, user: currentUser }, ...calleePeers]
                            .filter((peer) => selectedStream.id !== peer.stream.id)
                            .map((peer) => renderStream(peer, peer.user?.name || 'Unknown User'))}
                    </div>
                </div>
            ) : (
                <div className='flex flex-row flex-wrap items-center justify-center'>
                    {localStream && renderStream({ stream: localStream, user: currentUser }, currentUser?.name)}
                    {calleePeers.map((peer) => renderStream(peer, peer.user?.name || 'Unknown User'))}
                </div>
            )}
        </div>
    );
};

export default VideoGrid;
