import React, { PropTypes } from 'react';


const propTypes = {
  text: PropTypes.string.isRequired,
};

const HighlightedCode = ({ text }) => (
  <code className="highlight-yellow">
    {text}
  </code>
);

HighlightedCode.propTypes = propTypes;
export default HighlightedCode;
