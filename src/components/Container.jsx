
import PropTypes from 'prop-types';
const Container = ({ children }) => {
    return <div className='mx-auto max-w-[1000px]'>{children}</div>;
};

Container.propTypes = {
    children: PropTypes.node
};

export default Container;
