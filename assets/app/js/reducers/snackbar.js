import assign from 'object-assign';
import * as AppConstants from '../AppConstants';
/*
Example state tree:
const snackbar = {
  isOpen: false,
  message: '',
  background: '',
}
*/

const colorDefault = 'rgba(0, 0, 0, 0.870588)';
const colorWaring = 'rgba(226, 88, 88, 0.870588)';
const colorInfo = 'rgba(57, 144, 208, 0.870588)';

const snackbar = (state = {}, action) => {
  switch (action.type) {
    case AppConstants.INIT_SNACKBAR:
      return action.snackbar;
    case AppConstants.SNACKBAR_MESSAGE: {
      let colour = colorDefault;
      if (action.kind === 'warning') {
        colour = colorWaring;
      } else if (action.kind === 'info') {
        colour = colorInfo;
      }
      return assign({}, state, { isOpen: true, message: action.message, background: colour });
    }
    case AppConstants.UPDATE_SNACKBAR:
      return assign({}, state, action.snackbar);
    default:
      return state;
  }
};
export default snackbar;
