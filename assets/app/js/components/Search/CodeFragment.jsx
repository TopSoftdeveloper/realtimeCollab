import React, { PropTypes } from 'react';
import _ from 'lodash';
import HighlightedCode from './HighlightedCode.jsx';

const propTypes = {
  fragment: PropTypes.string.isRequired,
  matches: PropTypes.array.isRequired,
};

/**
 * Given a fragment and matching indicies, produces a code block with the matches highlighted
 * @props {fragment, matches}
 * Examples:
 * fragment: " routeManager\nimport mapper.mapper as mapper\nimport
 pedometer\nimport time\nimport RPi.GPIO as GPIO\nimport sys",}
 * matches:
 *  [{
     "indices": [
         21,
         27
     ]
    }]
 */
const CodeFragment = ({ fragment, matches }) => {
  const pieces = [];
  let prev = 0;
  matches.forEach(match => {
    const start = match.indices[0];
    const end = match.indices[1];
    const text = fragment.slice(prev, start);
    pieces.push(text);
    const str = fragment.slice(start, end);
    pieces.push(<HighlightedCode text={str} key={_.uniqueId()} />);
    prev = end;
  });
  pieces.push(fragment.slice(prev));

  return (
    <pre>
      <code>
        {pieces}
      </code>
    </pre>
  );
};
CodeFragment.propTypes = propTypes;
export default CodeFragment;
