import * as AppConstants from '../AppConstants';

const githubRepos = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_GITHUB_REPOS:
      return action.repos;
    default:
      return state;
  }
};

export default githubRepos;
