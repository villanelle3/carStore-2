import PropTypes from 'prop-types';

const modal2 = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className='modal2'>
        <div className='modal2-content'>
            <span className='close' onClick={onClose}>&times;</span>
            {children}
        </div>
        </div>
    );
};

modal2.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default modal2;
