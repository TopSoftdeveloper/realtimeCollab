import assign from 'object-assign';
import * as AppConstants from '../AppConstants';

/* Example state tree:
const app = {
  is_linked_to_drive: true,
  is_top_level_folder_loaded: false,
  github: {
    loading: false,
    repo_fetched: false,
  },
  files: {
    loading: false,
  },
  queriesInProgress: 0,
  loading: true,
  current_project: 'EkTq9OUdG',
  queryString: '',
  searchFilter: 'all',
};
*/
const app = (state = {}, action) => {
  switch (action.type) {
    case AppConstants.INIT_APP:
      return action.app;
    case AppConstants.UPDATE_APP_STATUS:
      return assign({}, state, action.app);
    case AppConstants.SWITCH_TO_PROJECT:
      return assign({}, state, { current_project: action.project_id });
    case AppConstants.LOGGED_INTO_GOOGLE:
      return assign({}, state, { is_linked_to_drive: true });
    case AppConstants.LOGGED_OUT_GOOGLE:
      return assign({}, state, { is_linked_to_drive: false });
    case AppConstants.QUERY_PROCESSING:
      return assign({}, state, { queriesInProgress: state.queriesInProgress + 1 });
    case AppConstants.QUERY_DONE:
      return assign({}, state, { queriesInProgress: state.queriesInProgress - 1 });
    default:
      return state;
  }
};
export default app;
