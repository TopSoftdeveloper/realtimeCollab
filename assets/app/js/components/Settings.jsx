import React, { Component, PropTypes } from 'react'
import { Panel, ListGroup, ListGroupItem, ButtonInput, Input, Alert, Button } from 'react-bootstrap'
import _ from 'lodash'
let AppConstants = require('../AppConstants');
import {getCurrentProject} from '../utils/general'
import LoadingIndicator from './LoadingIndicator.jsx'
import { browserHistory } from 'react-router'
import Github from './Github/Github.jsx'
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';

class Settings extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = {
            inputEmail: '',
            inputProjectName: '',
            fetchedRepos: false
        }            
    }

    selectNewRepo() {
        if (!this.props.app.github.repo_fetched) {
            this.props.actions.initGithubRepos()
        }
        this.props.actions.updateProject(this.props.project.id, {
            github_repo_name: null,
            github_repo_owner: null
        })
    }

    selectRootFolder() {
        let projectId = this.props.project.id
        this.props.actions.updateProject(projectId, {
            root_folder: null,
            directory_structure: [{name: 'Top level directory', id: 'root'}]
        })
        if (!this.props.app.is_top_level_folder_loaded) {
            this.props.actions.initTopLevelFolders()
        }

        let projectUrl = '/app/project/' + projectId + '/files'
        browserHistory.push(projectUrl)
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
            this.props.actions.renameProject(this.props.project.id, this.state.inputProjectName)
        }
    }

    render() {

        if (this.props.app.github.loading || this.props.app.files.loading) {
            return (
                <div className='settings'>
                    <LoadingIndicator/>
                </div>
            )
        }

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
        let rootFolderName = 'Not yet selected'
        if (project.root_folder && project.directory_structure[0]) {
            rootFolderName = project.directory_structure[0].name
        }

        let githubRepo = 'Not yet selected'
        let repoName = project.github_repo_name
        let repoOwner = project.github_repo_owner
        let repoSet = repoName && repoOwner
        let githubCard = null
        let selectNewRepoBtn = null

        if (repoSet) {
            githubRepo = project.github_repo_owner + '/' + project.github_repo_name
            selectNewRepoBtn = <Button
                onClick={this.selectNewRepo.bind(this)}
                className="settings-btn">
                Select new repository</Button>
        } else {
            githubCard =
                <Card>
                    <CardHeader
                        title="Enhance Collab's power with GitHub!"
                        actAsExpander={true}
                        showExpandableButton={true}
                    />
                    <CardText expandable={true}>
                        <Github
                            project={this.props.project}
                            actions={this.props.actions}
                            app={this.props.app}
                            repos={this.props.repos}
                        />
                    </CardText>
                </Card>
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
                    <span><b>Root folder: {rootFolderName}</b></span>
                    <Button onClick={this.selectRootFolder.bind(this)} className="settings-btn">Select new root folder</Button>
                </Panel>

                <Panel header='GitHub Integration' bsStyle="info">
                    <span><b>Default repository: {githubRepo}</b></span>
                    {selectNewRepoBtn}
                    <br/>
                    {githubCard}
                </Panel>

                <Panel header='Options' bsStyle="info">
                    <form onSubmit={this.renameProject.bind(this)}>
                        <Input
                            type="text"
                            label={"Project name: " + this.props.project.content}
                            ref='projectNameInput'
                            value={this.state.inputProjectName}
                            placeholder="New project name"
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
     