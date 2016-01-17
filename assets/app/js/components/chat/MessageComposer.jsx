import React, { Component, PropTypes } from 'react'
import TextField from 'material-ui/lib/text-field';


class MessageComposer extends Component {
    constructor(props, context) {
        super(props, context)
    }

    sendMessage() {
        this.props.actions.sendMessage(this.refs.textfield.getValue())
        setTimeout(function() {
            this.refs.textfield.clearValue()
        }.bind(this), 5) // slight delay to clear newline as it comes after getValue
    }

    render() {
        return (
            <TextField
                fullWidth={true}
                hintText="Type a message"
                multiLine={true}
                rowsMax={3}
                onEnterKeyDown={this.sendMessage.bind(this)}
                ref="textfield"
            />
        )
    }
}

export default MessageComposer