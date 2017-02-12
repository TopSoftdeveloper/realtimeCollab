import React, { PropTypes } from 'react';
import Snackbar from 'material-ui/Snackbar';

const propTypes = {
  snackbar: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
const ISnackbar = ({ snackbar, onRequestClose }) => (
  <Snackbar
    open={snackbar.isOpen}
    message={snackbar.message}
    autoHideDuration={3500}
    bodyStyle={{ background: snackbar.background }}
    onRequestClose={onRequestClose}
  />
);
ISnackbar.propTypes = propTypes;

export default ISnackbar;
