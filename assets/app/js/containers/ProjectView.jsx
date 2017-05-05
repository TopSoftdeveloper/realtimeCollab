import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions/ReduxTaskActions';
import { getCurrentProject, getProjectActiveUsers, getProjectPendingUsers } from '../selector';
import Project from '../components/Project.jsx';

const mapStateToProps = (state) => ({
  currentProject: getCurrentProject(state),
  activeUsers: getProjectActiveUsers(state),
  pendingUsers: getProjectPendingUsers(state),
  app: state.app,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
