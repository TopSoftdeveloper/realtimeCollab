import { connect } from 'react-redux';

import { getProjectEvents } from '../selector';
import Newsfeed from '../components/Newsfeed/Newsfeed.jsx';

const mapStateToProps = (state) => (
  {
    events: getProjectEvents(state),
  }
);

export default connect(mapStateToProps)(Newsfeed);
