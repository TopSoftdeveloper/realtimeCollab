import React, { PropTypes } from 'react';
import Avatar from 'material-ui/Avatar';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const UserAvatar = ({ imgSrc, displayName, enableTooltip, isSquare, memberColour, size }) => {
  let image = null;
  let styles = {};
  if (memberColour) {
    styles = {
      borderBottomStyle: 'solid',
      borderBottomColor: memberColour,
      borderBottomWidth: '7px',
    };
  }

  if (imgSrc && imgSrc !== 'undefined') {
    image = (
      <Avatar
        size={size}
        src={imgSrc}
        className={isSquare ? 'square-avatar' : ''}
        style={styles}
      />
    );
  } else {
    image = (
      <Avatar
        size={size}
        style={styles}
      >
        {displayName[0]}
      </Avatar>
    );
  }

  if (enableTooltip) {
    const tooltip = (
      <Tooltip id={displayName}>{displayName}</Tooltip>
    );
    image = (
      <OverlayTrigger placement="bottom" overlay={tooltip}>
        {image}
      </OverlayTrigger>
    );
  }
  return image;
};

UserAvatar.proptypes = {
  imgSrc: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  enableTooltip: PropTypes.bool,
  isSquare: PropTypes.bool,
  memberColour: PropTypes.string,
  size: PropTypes.number,
};
UserAvatar.defaultProps = {
  enableTooltip: false,
  isSquare: false,
  size: 36,
};
export default UserAvatar;
