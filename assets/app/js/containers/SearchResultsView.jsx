import { connect } from 'react-redux';
import SearchResults from '../components/Search/SearchResults.jsx';

function mapStateToProps(state) {
  return {
    search: state.search,
    app: state.app,
  };
}

export default connect(mapStateToProps)(SearchResults);
