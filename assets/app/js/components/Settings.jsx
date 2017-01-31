import React, {Component, PropTypes} from 'react'
import { Panel, ListGroup, ListGroupItem, ButtonInput, Input, Alert, Button } from 'react-bootstrap'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton'

import {getGithubAuthCode, getCurrentProject} from '../utils/general'
import {githubOAuth} from '../utils/apiUtil'
import {APP_ROOT_URL, PATH, GITHUB_CLIENT_ID, INVITED_TO_PROJECT, USER_ALREADY_EXISTS, USER_NOT_FOUND} from '../AppConstants';
import LoadingIndicator from './LoadingIndicator.jsx'
import Github from './Github/Github.jsx'

class Settings extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            inputEmail: '',
            inputProjectName: '',
            chatName: '',
            fetchedRepos: false
        }
    }

    changeChatRoom(e) {
        e.preventDefault()
        if (this.state.chatName.trim()) {
            this.props.actions.changeChatRoom(this.props.project.id, this.state.chatName)
        }
    }

    authorize() {
        let redirectURI = APP_ROOT_URL + '/project/' + this.props.project.id + '/' + PATH.settings
        window.location.assign('https://github.com/login/oauth/authorize?client_id=' + GITHUB_CLIENT_ID +
            '&scope=repo,notifications,user&redirect_uri=' + redirectURI)
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

    chatNameChange() {
        this.setState({
            chatName: this.refs.chatNameInput.getValue()
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

    componentDidMount() {
        // We check whether this is a redirect from github OAuth by checking
        // if there is a "code" query param
        let code = getGithubAuthCode()
        if (code) {
            githubOAuth(code).done(res => {
                if (!res.error) {
                    localStorage.setItem('github_token', res.access_token)
                    this.props.actions.updateAppStatus({github_token: res.access_token})
                    this.props.actions.updateGithubLogin(res.access_token)
                    if (!this.props.app.github.repo_fetched) {
                        this.props.actions.initGithubRepos()
                    }
                }
            }).fail(e => console.log(e))
        }
    }

    render() {
      console.log('Settings::render()')
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
        if (alertStatus === INVITED_TO_PROJECT) {
            alertPanel = (
                <Alert
                    bsStyle="success"
                    onDismiss={this.handleAlertDismiss.bind(this)}
                    dismissAfter={4000}
                    >
                    Successfully invited!
                </Alert>
            );
        } else if (alertStatus === USER_ALREADY_EXISTS) {
            alertPanel = (
                <Alert
                    bsStyle="warning"
                    onDismiss={this.handleAlertDismiss.bind(this)}
                    dismissAfter={4000}
                >
                    User already invited!
                </Alert>
            );
        } else if (alertStatus === USER_NOT_FOUND) {
            alertPanel = (
                <Alert
                    bsStyle="danger"
                    onDismiss={this.handleAlertDismiss.bind(this)}
                    dismissAfter={4000}
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
        let repoSet = !!(repoName && repoOwner)
        let githubCard = null
        let selectNewRepoBtn = null

        if (repoSet && !this.props.app.github.loading) {
            githubRepo = project.github_repo_owner + '/' + project.github_repo_name
            selectNewRepoBtn = <Button
                onClick={this.selectNewRepo.bind(this)}
                className="settings-btn">
                Select new repository</Button>
        } else {
            githubCard =
                <Card initiallyExpanded={true}>
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
                            authorize={this.authorize.bind(this)}
                        />
                    </CardText>
                </Card>
        }


        let googlePanel = <LoadingIndicator className="loading-indicator-left" size={0.4}/>
        let githubPanel = <LoadingIndicator className="loading-indicator-left" size={0.4}/>

        if (!this.props.app.files.loading) {
            let style = {}
            if (project.folder_error) {
                rootFolderName = project.folder_error
                style={color: 'red'}
            }
            googlePanel = (
                <div>
                    <span style={style}><b>Root folder: {rootFolderName}</b></span>
                    <Button onClick={this.selectRootFolder.bind(this)} className="settings-btn">Select new root folder</Button>
                </div>
            )
        }

        if (!this.props.app.github.loading) {
            let style = {}
            if (project.github_error) {
                githubRepo = project.github_error
                style={color: 'red'}
            }
            githubPanel = (
                <div>
                    <span style={style}><b>Default repository: {githubRepo}</b></span>
                    {selectNewRepoBtn}
                    <br/>
                    <br/>
                    {githubCard}
                </div>
            )
        }

        if (!localStorage.github_token && repoSet) {
            // Repo set but not authorized
            githubPanel = (
                <div>
                    <div style={{color: 'red'}}><b>Please re-authorize Github</b></div>
                    <br/>
                    <RaisedButton
                        label="Authorize Github"
                        onTouchTap={this.authorize.bind(this)}
                        primary={true}
                        icon={<FontIcon className="fa fa-github"/>}
                    />
                </div>
            )
        }

        let chatName = 'None'
        if (project.chatroom) {
            chatName = project.chatroom
        }
        let chatLabel = 'Current chat room: ' + chatName

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
                    {googlePanel}
                </Panel>

                <Panel header='GitHub Integration' bsStyle="info">
                    {githubPanel}
                </Panel>

                <Panel header='Chat Room' bsStyle="info">
                    <form onSubmit={this.changeChatRoom.bind(this)}>
                        <Input
                            type="text"
                            label={chatLabel}
                            ref='chatNameInput'
                            value={this.state.chatName}
                            placeholder="Chat room name"
                            onChange={this.chatNameChange.bind(this)}
                            buttonAfter={<ButtonInput value="Join" type="submit"/>}
                        />
                    </form>
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
                    <br/>
                </Panel>
            </div>
        );
    }
}

Settings.propTypes = {
  // props passed by parents
  actions: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  allActiveUsers: PropTypes.array.isRequired,
  pendingUsers: PropTypes.array.isRequired,
  // props passed by container
  alerts: PropTypes.object.isRequired,
  repos: PropTypes.array
}

export default Settings;
