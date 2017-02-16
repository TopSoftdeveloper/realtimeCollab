import { connect } from 'react-redux';

import FileView from '../components/File/FileView.jsx';

const mapStateToProps = (state) => ({
  files: state.files,
});

export default connect(mapStateToProps)(FileView);
