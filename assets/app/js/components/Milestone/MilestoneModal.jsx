import React, { Component } from 'react'
import MoreVert from 'material-ui/svg-icons/navigation/more-vert'
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import {Form} from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import FormsyDate from 'formsy-material-ui/lib/FormsyDate'

const styles = {
    marginBottom: 16,
    maxWidth: 250
}

class MilestoneModal extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            deadline: this.props.deadline,
            canSubmit: false
        }
    }
    enableButton() {
      this.setState({
        canSubmit: true,
      });
    }

    disableButton() {
      this.setState({
        canSubmit: false,
      });
    }

    onDialogSubmit() {
        let content = this.refs.milestoneField.getValue().trim()
        let newDate = new Date(this.state.deadline)
        let isoDate  = null
        if (new Date().getTime() < newDate.getTime()) { // deadline must be after current time
            isoDate = newDate.toISOString()
        }
        if (content !== '') {
            this.props.method(content, isoDate)
        }
        this.props.handleClose()
    }

    formatDate(date) {
        let options = {year: 'numeric', month: 'long', day: 'numeric' }
        return date.toLocaleDateString('en-US', options)
    }


    onDateChange(first, newDate) {
        //Since there is no particular event associated with the change
        //the first argument will always be null and the
        //second argument will be the new Date instance.
        this.setState({
            deadline: newDate
        })
    }

    render() {
        let actions = [
            <FlatButton
                key={1}
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handleClose} />,
            <FlatButton
                key={2}
                label="Submit"
                primary={true}
                onTouchTap={this.onDialogSubmit.bind(this)}
                disabled={!this.state.canSubmit} />
        ]

        let picker = (
            <DatePicker
                hintText="Select a date"
                autoOk={true}
                formatDate={this.formatDate.bind(this)}
                onChange={this.onDateChange.bind(this)}
                minDate={new Date()}
            />
        )

        if (this.props.deadline) {
          let defaultDate = new Date(this.props.deadline)
          picker = (
          <DatePicker
              hintText="Select a date"
              autoOk={true}
              formatDate={this.formatDate.bind(this)}
              onChange={this.onDateChange.bind(this)}
              defaultDate={new Date(this.props.deadline)}
              minDate={new Date()}
          />)
        }




        return (
            <Dialog
                autoScrollBodyContent
                title={this.props.title}
                actions={actions}
                onRequestClose={this.props.handleClose}
                open={this.props.open}>
                <Form
                    onValid={this.enableButton.bind(this)}
                    onInvalid={this.disableButton.bind(this)}
                    onValidSubmit={this.onDialogSubmit.bind(this)}
                >
                <FormsyText
                    autoFocus
                    value = {this.props.content}
                    required
                    name="Milestone name"
                    floatingLabelText="Milestone Name(required)"
                    ref="milestoneField"
                />
                <br/>

                {picker}
              </Form>
            </Dialog>
        )
    }
}

export default MilestoneModal
