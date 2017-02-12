import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

const defaultProps = {
  size: 40,
  className: '',
};

const LoadingIndicator = ({ size, className }) => (
  <div className={className}>
    <CircularProgress size={size} />
  </div>
);

LoadingIndicator.defaultProps = defaultProps;
LoadingIndicator.propTypes = propTypes;
export default LoadingIndicator;
