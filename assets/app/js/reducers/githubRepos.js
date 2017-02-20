import * as AppConstants from '../AppConstants';

/*
Example state tree:
githubRepos = [
  {
    "id": 42383923,
    "name": "-CViA-Curriculum-Vitae-Analyzer",
    "full_name": "a13576606825/-CViA-Curriculum-Vitae-Analyzer",
    "owner": {
      "login": "a13576606825",
      "id": 7593504,
      "avatar_url": "https://avatars.githubusercontent.com/u/7593504?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/a13576606825",
      "html_url": "https://github.com/a13576606825",
    },
    "private": false,
    "html_url": "https://github.com/a13576606825/-CViA-Curriculum-Vitae-Analyzer",
    "description": "resume parser and analyzer built with JAVA",
    "has_pages": false,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    }
  },
  ...
]
*/
const githubRepos = (state = [], action) => {
  switch (action.type) {
    case AppConstants.INIT_GITHUB_REPOS:
      return action.repos;
    default:
      return state;
  }
};

export default githubRepos;
