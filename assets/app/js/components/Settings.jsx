import React, { Component, PropTypes } from 'react'
import { Panel, ListGroup, ListGroupItem, ButtonInput, Input, Alert } from 'react-bootstrap'
import _ from 'lodash'
let AppConstants = require('../AppConstants');

class Settings extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            inputEmail: ''
        }            
    }

    handleChange() {
        this.setState({
            inputEmail: this.refs.addMemberInput.getValue()
        });
    }

    handleAlertDismiss() {
        this.props.actions.dismissProjectAlert();
    }

    inviteMember(e) {
        e.preventDefault();
        let email = this.state.inputEmail.trim();
        if (email !== '') {
            this.props.actions.inviteToProject(this.props.projectId, email);
        }     
        this.setState({
            inputEmail: ''
        });        
    }

    render() {   
        let listGroups = [];
        let alertStatus = this.props.alerts.project_invitation;
        listGroups.push(
            <ListGroupItem key={_.uniqueId('settings_creator')}>
                {this.props.projectCreator.display_name} (creator)
            </ListGroupItem>);
        this.props.basicUsers.forEach(user => listGroups.push(
            <ListGroupItem key={_.uniqueId('settings_basic')}>
                {user.display_name}
            </ListGroupItem>
        ));

        this.props.pendingUsers.forEach(user => listGroups.push(
            <ListGroupItem key={_.uniqueId('settings_pending')}>
                {user.display_name} (pending)
            </ListGroupItem>
        ));

        let alertPanel = (<br></br>); 
        if (alertStatus === AppConstants.INVITED_TO_PROJECT) {
            alertPanel = (
                <Alert 
                    bsStyle="success" 
                    onDismiss={this.handleAlertDismiss.bind(this)}  
                    dismissAfter={2500}>
                    Successfully invited!
                </Alert>
            );
        } else if (alertStatus === AppConstants.USER_ALREADY_EXISTS) {
            alertPanel = (
                <Alert 
                    bsStyle="warning" 
                    onDismiss={this.handleAlertDismiss.bind(this)} 
                    dismissAfter={2500}>
                    User already invited!
                </Alert>
            );            
        } else if (alertStatus === AppConstants.USER_NOT_FOUND) {
            alertPanel = (
                <Alert 
                    bsStyle="danger" 
                    onDismiss={this.handleAlertDismiss.bind(this)} 
                    dismissAfter={2500}>
                    User not found!
                </Alert>
            );              
        }      

        return (
            <div className='settings'>
                <ListGroup>
                    <ListGroupItem bsStyle="info">Members</ListGroupItem>
                        {listGroups}
                    <ListGroupItem>
                        {alertPanel}
                        <form onSubmit={this.inviteMember.bind(this)}>
                            <Input 
                                type="email" 
                                label="Search by email" 
                                ref='addMemberInput'
                                buttonAfter={<ButtonInput value="Invite member" type="submit"/>}
                                value={this.state.inputEmail}
                                onChange={this.handleChange.bind(this)} 
                            />
                        </form>
                    </ListGroupItem>
                </ListGroup>

                <Panel header='Options'>
                    <form>
                        <Input 
                            type="text" 
                            label="Project name" 
                            defaultValue={this.props.projectName} 
                            buttonAfter={<ButtonInput value="Rename"/>}
                        />
                    </form>                
                </Panel>                
            </div>
        );
    }
}

export default Settings;
     