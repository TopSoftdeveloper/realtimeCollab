import React, { PropTypes } from 'react';
import assign from 'object-assign';
import { ListItem } from 'material-ui/List';
import { Color } from '../myTheme.js';
import ClippedText from './Common/ClippedText.jsx';

const propTypes = {
  projectId: PropTypes.string.isRequired,
  projectContent: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onSwitchProject: PropTypes.func.isRequired,
  itemStyle: PropTypes.object,
};
const NUMBER_LIMIT = 20;
const ProjectListItem = ({ projectId, projectContent, active, onSwitchProject, itemStyle }) => {
  const switchProject = onSwitchProject.bind(null, projectId);
  return (
    <ListItem
      id={`project-${projectContent}`}
      className="left-panel-item"
      key={projectId}
      onTouchTap={switchProject}
      innerDivStyle={assign({}, itemStyle, active && {
        backgroundColor: Color.leftPanelItemHightColor,
        color: 'white',
      })}
      hoverColor={Color.leftPanelItemHightColor}
      primaryText={<ClippedText text={projectContent} limit={NUMBER_LIMIT} />}
    />
  );
};
ProjectListItem.propTypes = propTypes;

export default ProjectListItem;
