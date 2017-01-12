import React, { Component, PropTypes } from 'react'
import UserAvatar from './UserAvatar.jsx'
import _ from 'lodash'

class AvatarList extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {members, colour, isSquare, className} = this.props
        let avatars = members && members.map(
          member => {
            let memberColour = colour ? member.colour : false
            let image = <UserAvatar
              imgSrc={member.display_image}
              displayName={member.display_name}
              enableTooltip={true}
              isSquare={isSquare}
              memberColour={memberColour} />
            return (
                <li key={_.uniqueId()}>
                    {image}
                </li>)
        })
        return (
            <div className={className + " avatar-list-wrapper"}>
                <ul className='avatar-list'>{avatars}</ul>
            </div>
        );
    }
}
AvatarList.defaultProps = {
  colour: false,
  isSquare: false,
  className: '',
};


AvatarList.proptypes = {
  members: PropTypes.array.isRequired,
  colour: PropTypes.bool,
  isSquare: PropTypes.bool,
  className: PropTypes.string,
}

export default AvatarList
