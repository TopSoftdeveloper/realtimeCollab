import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard/Dashboard.jsx';
import { markDone } from '../actions/ReduxTaskActions.js';

const mapStateToProps = (state) => ({
  milestones: state.milestones,
  projects: state.projects,
  tasks: state.tasks,
});
const mapDispatchToProps = (dispatch) => ({
  actions: {
    onMarkTaskAsDone: (taskId, projectId) => {
      markDone(taskId, projectId)(dispatch);
    },
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
