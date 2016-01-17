import React, { Component, PropTypes } from 'react'

class MessageListItem extends Component {
    constructor(props, context) {
        super(props, context)
    }

    render() {
        let message = this.props.message
        return (
            <li className="message-list-item">
                <h5 className="message-author-name">{message.authorName}</h5>
                <div className="message-time">
                    {message.timestamp}
                </div>
                <div className="message-text">{message.text}</div>
            </li>
        )
    }
}

export default MessageListItem