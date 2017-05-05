import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../actions/ReduxTaskActions';
import * as SocketActions from '../actions/SocketActions';
import App from '../components/App.jsx';

const mapStateToProps = (state) => ({
  notifications: state.notifications,
  projects: state.projects,
  users: state.users,
  tasks: state.tasks,
  app: state.app,
  search: state.search,

});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
  socketActions: bindActionCreators(SocketActions, dispatch),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
