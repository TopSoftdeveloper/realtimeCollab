import React, { PropTypes } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const propTypes = {
  text: PropTypes.string.isRequired,
  limit: PropTypes.number.isRequired,
  indicator: PropTypes.string,
  placement: React.PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  textStyle: PropTypes.object,
};
const defaultProps = {
  indicator: '...',
  placement: 'right',
};

const styles = {
  tooltip: {
  },
  overlayTrigger: {
  },
  tooltipContent: {
    width: 'auto',
    maxWidth: 'none',
    wordBreak: 'break-all',
  },
};
/**
  renders clipped text with limit of text length and trailing indicator
  shows tooltip for the clipped part
*/
const ClippedText = (props) => {
  const { text, limit, indicator, textStyle, placement } = props;
  if (text.length <= limit) {
    return (
      <span style={textStyle}>
        {text}
      </span>
    );
  }
  return (
    <OverlayTrigger
      style={styles.overlayTrigger}
      placement={placement}
      overlay={
        <Tooltip style={styles.tooltip} id={text}>
          <span style={styles.tooltipContent}>
            {text}
          </span>
        </Tooltip>
      }
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
