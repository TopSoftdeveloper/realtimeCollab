import React, { PropTypes } from 'react';
import _ from 'lodash';

import UserAvatar from './UserAvatar.jsx';

const propTypes = {
  members: PropTypes.array.isRequired,
  colour: PropTypes.bool,
  isSquare: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.number,
};
const defaultProps = {
  colour: false,
  isSquare: false,
  className: '',
};

const AvatarList = ({ members, colour, isSquare, className, size }) => {
  const avatars = members.map(member => {
    const memberColour = colour ? member.colour : false;
    const image = (
      <UserAvatar
        imgSrc={member.display_image}
        displayName={member.display_name}
        enableTooltip
        isSquare={isSquare}
        memberColour={memberColour}
        size={size}
      />
    );
    return (
      <li key={_.uniqueId()}>
        {image}
      </li>
    );
  });
  return (
    <div className={`avatar-list-wrapper ${className}`}>
      <ul className="avatar-list">
        {avatars}
      </ul>
    </div>
  );
};

AvatarList.defaultProps = defaultProps;
AvatarList.propTypes = propTypes;

export default AvatarList;
