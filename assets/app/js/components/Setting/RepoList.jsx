import React, { PropTypes } from 'react';

import RepoListItem from './RepoListItem.jsx';

const propTypes = {
  repos: PropTypes.array.isRequired,
  syncWithGithub: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  reposFetched: PropTypes.string.isRequired,
};

const RepoList = ({ repos, syncWithGithub, projectId, reposFetched }) => {
  const repoList = repos.map(repo => (
    <RepoListItem
      key={repo.id}
      name={repo.name}
      owner={repo.owner.login}
      primaryText={repo.full_name}
      secondaryText={repo.description}
      repoLink={repo.html_url}
      syncWithGithub={syncWithGithub}
      projectId={projectId}
    />
  ));
  if (repoList.length === 0 && reposFetched) {
    return (
      <div className="github-repo-list">
        <div className="no-items">
          <h3>You don't have any GitHub repositories!</h3>
        </div>
      </div>
    );
  }
  return (
    <div className="github-repo-list">
      <ul>
        {repoList}
      </ul>
    </div>
  );
};
RepoList.propTypes = propTypes;
export default RepoList;
