import { connect } from 'react-redux';

import Settings from '../components/Setting/Settings.jsx';

const mapStateToProps = (state) => ({
  alerts: state.alerts,
  repos: state.githubRepos,
});

export default connect(mapStateToProps)(Settings);
