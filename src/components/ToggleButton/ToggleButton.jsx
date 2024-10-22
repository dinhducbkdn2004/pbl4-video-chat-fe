import './ToggleButton.css';

const ToggleButton = ({ isDarkMode, toggleTheme }) => {
    return (
        <div className='toggle-wrapper'>
            <input type='checkbox' id='toggle-checkbox' checked={isDarkMode} onChange={toggleTheme} />
            <label htmlFor='toggle-checkbox' className='toggle-label'>
                <span className='toggle-button'>
                    <span className='crater crater-1'></span>
                    <span className='crater crater-2'></span>
                    <span className='crater crater-3'></span>
                    <span className='crater crater-4'></span>
                    <span className='crater crater-5'></span>
                    <span className='crater crater-6'></span>
                    <span className='crater crater-7'></span>
                </span>
                <span className='star star-1'></span>
                <span className='star star-2'></span>
                <span className='star star-3'></span>
                <span className='star star-4'></span>
                <span className='star star-5'></span>
                <span className='star star-6'></span>
                <span className='star star-7'></span>
                <span className='star star-8'></span>
            </label>
        </div>
    );
};

export default ToggleButton;