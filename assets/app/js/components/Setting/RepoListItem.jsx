import React, { PropTypes } from 'react';

import FlatButton from 'material-ui/FlatButton';

const propTypes = {
  syncWithGithub: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  repoLink: PropTypes.string.isRequired,
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

const RepoListItem = ({ syncWithGithub, projectId, name, owner,
repoLink, primaryText, secondaryText }) => (
  <li>
    <FlatButton
      className="select-repo-btn"
      label="Select"
      secondary
      onTouchTap={syncWithGithub.bind(this, projectId, name, owner)}
    />
    <h4>
      <a
        href={repoLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        {primaryText}
      </a>
    </h4>
    <p>{secondaryText}</p>
  </li>
);

RepoListItem.propTypes = propTypes;
export default RepoListItem;
