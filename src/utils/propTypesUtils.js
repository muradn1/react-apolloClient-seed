import PropTypes from 'prop-types';

export const primitive = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
]);