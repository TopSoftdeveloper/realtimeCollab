import React, { PropTypes } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const propTypes = {
  text: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired,
  indicator: PropTypes.string,
  textStyle: PropTypes.object,
};
const defaultProps = {
  indicator: '...',
};

/**
  renders clipped text with limit of text length and trailing indicator
  shows tooltip for the clipped part
*/
const ClippedText = (props) => {
  const { text, limit, indicator, textStyle } = props;
  if (text.length <= limit) {
    return (
      <span style={textStyle}>
        {text}
      </span>
    );
  }
  return (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip id={text}>{text.substring(limit - indicator.length - 1)}</Tooltip>}
    >
      <span style={textStyle}>
        {`${text.substring(0, limit - indicator.length - 1)}${indicator}`}
      </span>
    </OverlayTrigger>
  );
};
ClippedText.propTypes = propTypes;
ClippedText.defaultProps = defaultProps;

export default ClippedText;
