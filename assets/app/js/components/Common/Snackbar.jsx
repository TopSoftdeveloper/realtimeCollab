import React, { PropTypes } from 'react';
import MSnackbar from 'material-ui/Snackbar';

const propTypes = {
  snackbar: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
const Snackbar = ({ snackbar, onRequestClose }) => (
  <MSnackbar
    open={snackbar.isOpen}
    message={snackbar.message}
    autoHideDuration={3500}
    bodyStyle={{ background: snackbar.background }}
    onRequestClose={onRequestClose}
  />
);
Snackbar.propTypes = propTypes;

export default Snackbar;
