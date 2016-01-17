import React, { Component, PropTypes } from 'react'
import MessageListItem from './MessageListItem.jsx'
import MessageComposer from './MessageComposer.jsx'

function getMessageListItem(message) {
    return (
        <MessageListItem
            key={message.id}
            message={message}
        />
    );
}

class MessageSection extends Component {
    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        this.scrollToBottom()
    }

    scrollToBottom() {
        let ul = this.refs.messageList
        ul.scrollTop = ul.scrollHeight
    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    render() {
        let messageListItems = this.props.messages.map(getMessageListItem)

        return (
            <div className="message-section">
                <ul className="message-list" ref="messageList">
                    {messageListItems}
                </ul>
                <MessageComposer
                    actions={this.props.actions}
                />
            </div>
        )
    }

}

export default MessageSection