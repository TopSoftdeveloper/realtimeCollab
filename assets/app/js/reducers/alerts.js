import assign from 'object-assign';

import * as AppConstants from '../AppConstants';

// Example state tree:
//  {
//    project_invitation: 'INVITED_TO_PROJECT/USER_NOT_FOUND/USER_ALREADY_EXISTS'
//  }

const alerts = (state = { project_invitation: null }, action) => {
  switch (action.type) {
    case AppConstants.PROJECT_INVITATION_ALERT:
      return assign({}, state, { project_invitation: action.alert });
    default:
      return state;
  }
};

export default alerts;
