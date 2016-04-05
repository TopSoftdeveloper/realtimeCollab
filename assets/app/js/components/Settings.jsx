import React, { Component, PropTypes } from 'react'
import { Panel, ListGroup, ListGroupItem, ButtonInput, Input, Alert, Button } from 'react-bootstrap'
import _ from 'lodash'
let AppConstants = require('../AppConstants');
import {getCurrentProject} from '../utils/general'

class Settings extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            inputEmail: '',
            inputProjectName: ''
        }            
    }

    handleChange() {
        this.setState({
            inputEmail: this.refs.addMemberInput.getValue()
        });
    }

    projectNameChange() {
        this.setState({
            inputProjectName: this.refs.projectNameInput.getValue()
        });
    }

    handleAlertDismiss() {
        this.props.actions.dismissProjectAlert();
    }

    inviteMember(e) {
        e.preventDefault();
        let email = this.state.inputEmail.trim();
        if (email !== '') {
            this.props.actions.inviteToProject(this.props.project.id, email);
        }     
        this.setState({
            inputEmail: ''
        });        
    }

    renameProject(e) {
        e.preventDefault()
        if (this.state.inputProjectName.trim()) {
            
        }
    }

    render() {   
        let listGroups = [];
        let alertStatus = this.props.alerts.project_invitation;

        this.props.allActiveUsers.forEach(user => listGroups.push(
            <ListGroupItem key={_.uniqueId('settings_users')}>
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
                    >
                    Successfully invited!
                </Alert>
            );
        } else if (alertStatus === AppConstants.USER_ALREADY_EXISTS) {
            alertPanel = (
                <Alert 
                    bsStyle="warning" 
                    onDismiss={this.handleAlertDismiss.bind(this)} 
                    >
                    User already invited!
                </Alert>
            );            
        } else if (alertStatus === AppConstants.USER_NOT_FOUND) {
            alertPanel = (
                <Alert 
                    bsStyle="danger" 
                    onDismiss={this.handleAlertDismiss.bind(this)} 
                    >
                    User not found!
                </Alert>
            );              
        }
        let project = this.props.project
        let projectName = project.content
        let rootFolderName = 'Not yet selected'
        if (project.root_folder && project.directory_structure[0]) {
            rootFolderName = project.directory_structure[0].name
        }

        let githubRepo = 'Not yet selected'
        if (project.github_repo_owner && project.github_repo_name) {
            githubRepo = project.github_repo_owner + '/' + project.github_repo_name
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

                <Panel header='Google Integration' bsStyle="info">
                    <div>Root Folder: <b>{rootFolderName}</b></div>
                    <br/>
                    <Button>Select New Root Folder</Button>
                </Panel>

                <Panel header='GitHub Integration' bsStyle="info">
                    <div>Default Repository: <b>{githubRepo}</b></div>
                    <br/>
                    <Button>Select New Repository</Button>
                </Panel>

                <Panel header='Options' bsStyle="info">
                    <form onSubmit={this.renameProject.bind(this)}>
                        <Input
                            type="text"
                            label="Project name"
                            ref='projectNameInput'
                            value={projectName}
                            onChange={this.projectNameChange.bind(this)}
                            buttonAfter={<ButtonInput value="Rename" type="submit"/>}
                        />
                    </form>
                    <Button bsStyle="danger">Leave Project</Button>
                </Panel>                
            </div>
        );
    }
}

export default Settings;
     