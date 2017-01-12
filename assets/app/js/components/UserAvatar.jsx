import React, { Component } from 'react'
import Avatar from 'material-ui/lib/avatar';
import {Tooltip, OverlayTrigger} from 'react-bootstrap'

const UserAvatar = ({imgSrc, displayName, enableTooltip, isSquare, memberColour}) => {
  let image = null
  let className = isSquare ? "square-avatar" : ""
  let styles = {}
  if (memberColour) {
    styles = {
      borderBottomStyle: 'solid',
      borderBottomColor: memberColour,
      borderBottomWidth: '7px'
    }
  }

  if (imgSrc && imgSrc !== 'undefined') {
    image = <Avatar size={36} src={imgSrc} className={className} style={styles}/>
  } else {
    image = <Avatar size={36} style={styles}>{displayName[0]}</Avatar>
  }

  if (enableTooltip) {
    const tooltip = (
      <Tooltip id={displayName}>{displayName}</Tooltip>
    );
    image = (
      <OverlayTrigger placement="bottom" overlay={tooltip}>
        {image}
      </OverlayTrigger>
    )
  }
  return image
}

export default UserAvatar
