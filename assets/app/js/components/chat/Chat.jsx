import React, { Component, PropTypes } from 'react'
import MessageSection from './MessageSection.jsx'

class Chat extends Component {
    constructor(props, context) {
        super(props, context)
    }

    render() {

        return (
            <div className="chatapp">
                <MessageSection
                    messages={this.props.messages}
                    actions={this.props.actions}
                />
            </div>
        )
    }

}

export default Chat