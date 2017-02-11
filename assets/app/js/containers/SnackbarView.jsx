import { connect } from 'react-redux';

import { updateSnackbar } from '../actions/ReduxTaskActions';
import Snackbar from '../components/Common/Snackbar.jsx';

const mapStateToProps = (state) => ({
  snackbar: state.snackbar,
});

const mapDispatchToProps = (dispatch) => ({
  onRequestClose: () => {
    dispatch(updateSnackbar({ isOpen: false }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
