import React, { Component } from 'react'
import _ from 'lodash'

class HighlightedText extends Component {
    render() {
        return (
            <code className="highlight-yellow">
                {this.props.text}
            </code>
        )
    }
}

class CodeFragment extends Component {
    /**
     * Given a fragment and matching indicies, produces a code block with the matches highlighted
     * @props {fragment, matches}
     * Examples:
     * fragment: " routeManager\nimport mapper.mapper as mapper\nimport pedometer\nimport time\nimport RPi.GPIO as GPIO\nimport sys",}
     * matches:
     * [{
         "indices": [
             21,
             27
         ]
     }]
     */

    render() {
        let fragment = this.props.fragment
        let pieces = []
        let prev = 0
        this.props.matches.forEach(function(match) {
            let start = match.indices[0];
            let end = match.indices[1];
            let text = fragment.slice(prev, start)
            pieces.push(text)
            let str = fragment.slice(start, end)
            pieces.push(<HighlightedText text={str} key={_.uniqueId()}/>)
            prev = end
        }.bind(this));
        pieces.push(fragment.slice(prev))

        return (
            <pre>
                <code>
                    {pieces}
                </code>
            </pre>)
    }
}

export default CodeFragment