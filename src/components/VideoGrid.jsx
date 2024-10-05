const VideoGrid = ({ localStream, calleePeers }) => {
    return (
        <div className='video-grid'>
            {/* Render the local stream (caller video) */}
            {localStream && (
                <div className='p-3'>
                    <video
                        ref={(el) => {
                            if (el) {
                                el.srcObject = localStream;
                            }
                        }}
                        autoPlay
                        muted
                    />
                    <div className='user-name'>You</div>
                </div>
            )}

            {/* Render the remote streams (callee videos) */}
            {calleePeers.map((remoteStream, index) => (
                <div key={index} className='p-3'>
                    <video
                        ref={(el) => {
                            if (el) {
                                el.srcObject = remoteStream;
                            }
                        }}
                        autoPlay
                    />
                    <div className='user-name'>Caller {index + 1}</div>
                </div>
            ))}
        </div>
    );
};

export default VideoGrid;
