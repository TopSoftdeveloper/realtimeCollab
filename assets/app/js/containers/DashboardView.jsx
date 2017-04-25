import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard/Dashboard.jsx';

const mapStateToProps = (state) => ({
  milestones: state.milestones,
  projects: state.projects,
  tasks: state.tasks,
});
export default connect(mapStateToProps)(Dashboard);
