import React, { Component, PropTypes } from 'react';
import { Panel, ListGroup, ListGroupItem, FormGroup, FormControl,
ControlLabel, InputGroup, Alert, Button } from 'react-bootstrap';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import { getGithubAuthCode } from '../../utils/general';
import { githubOAuth } from '../../utils/apiUtil';
import { APP_ROOT_URL, PATH, GITHUB_CLIENT_ID, INVITED_TO_PROJECT,
  USER_ALREADY_EXISTS, USER_NOT_FOUND } from '../../AppConstants';
import LoadingIndicator from '../Common/LoadingIndicator.jsx';
import Github from './Github.jsx';

const styles = {
  container: {
    height: '100%',
    overflowY: 'auto',
    marginTop: 10,
  },
  panelContainer: {
    marginBottom: 10,
    boxShadow: 'none',
    borderRadius: 0,
  },
  panelHeader: {
    backgroundColor: '#00BCD4',
    color: 'white',
    padding: 8,
    paddingLeft: 16,
  },
  panelContent: {
    padding: 8,
    paddingLeft: 16,
  },
  listGroupItem: { // remove left boreder & right border style
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
};
const propTypes = {
  // props passed by parents
  actions: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  allActiveUsers: PropTypes.array.isRequired,
  pendingUsers: PropTypes.array.isRequired,
  // props passed by container
  alerts: PropTypes.object.isRequired,
  repos: PropTypes.array,
};
/* global localStorage window */
class Settings extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      inputEmail: '',
      inputProjectName: '',
      chatName: '',
      fetchedRepos: false,
    };
    this.inviteMember = this.inviteMember.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.selectNewRepo = this.selectNewRepo.bind(this);
    this.authorize = this.authorize.bind(this);
    this.selectRootFolder = this.selectRootFolder.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeChatRoom = this.changeChatRoom.bind(this);
    this.chatNameChange = this.chatNameChange.bind(this);
    this.renameProject = this.renameProject.bind(this);
    this.projectNameChange = this.projectNameChange.bind(this);
  }

  componentDidMount() {
    // We check whether this is a redirect from github OAuth by checking
    // if there is a "code" query param
    const code = getGithubAuthCode();
    if (code) {
      githubOAuth(code).done(res => {
        if (!res.error) {
          localStorage.setItem('github_token', res.access_token);
          this.props.actions.updateAppStatus({ github_token: res.access_token });
          this.props.actions.updateGithubLogin(res.access_token);
          if (!this.props.app.github.repo_fetched) {
            this.props.actions.initGithubRepos();
          }
        }
      }).fail(e => console.log(e));
    }
  }
  changeChatRoom(e) {
    e.preventDefault();
    if (this.state.chatName.trim()) {
      this.props.actions.changeChatRoom(this.props.project.id, this.state.chatName);
    }
  }

  authorize() {
    const redirectURI = `${APP_ROOT_URL}/project/${this.props.project.id}/${PATH.settings}`;
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,notifications,user&redirect_uri=${redirectURI}`);
  }

  selectNewRepo() {
    if (!this.props.app.github.repo_fetched) {
      this.props.actions.initGithubRepos();
    }
    this.props.actions.updateProject(this.props.project.id, {
      github_repo_name: null,
      github_repo_owner: null,
    });
  }

  selectRootFolder() {
    const projectId = this.props.project.id;
    this.props.actions.updateProject(projectId, {
      root_folder: null,
      directory_structure: [{ name: 'Top level directory', id: 'root' }],
    });
    if (!this.props.app.is_top_level_folder_loaded) {
      this.props.actions.initTopLevelFolders();
    }
    const projectUrl = `/app/project/${projectId}/files`;
    browserHistory.push(projectUrl);
  }
  handleChange(event) {
    this.setState({
      inputEmail: event.target.value,
    });
  }
  projectNameChange(event) {
    this.setState({
      inputProjectName: event.target.value,
    });
  }

  chatNameChange(event) {
    this.setState({
      chatName: event.target.value,
    });
  }

  handleAlertDismiss() {
    this.props.actions.dismissProjectAlert();
  }

  inviteMember(e) {
    e.preventDefault();
    const email = this.state.inputEmail.trim();
    if (email !== '') {
      this.props.actions.inviteToProject(this.props.project.id, email);
    }
    this.setState({
      inputEmail: '',
    });
  }

  renameProject(e) {
    e.preventDefault();
    if (this.state.inputProjectName.trim()) {
      this.props.actions.renameProject(this.props.project.id, this.state.inputProjectName);
    }
  }

  render() {
    const listGroups = [];
    const alertStatus = this.props.alerts.project_invitation;
    this.props.allActiveUsers.forEach(user => listGroups.push(
      <ListGroupItem style={styles.listGroupItem} key={_.uniqueId('settings_users')}>
        {user.display_name}
      </ListGroupItem>
    ));
    this.props.pendingUsers.forEach(user => listGroups.push(
      <ListGroupItem style={styles.listGroupItem} key={_.uniqueId('settings_pending')}>
        {user.display_name} (pending)
      </ListGroupItem>
    ));
    let alertPanel = <br />;
    if (alertStatus === INVITED_TO_PROJECT) {
      alertPanel = (
        <Alert
          bsStyle="success"
          onDismiss={this.handleAlertDismiss}
        >
          Successfully invited!
        </Alert>
      );
    } else if (alertStatus === USER_ALREADY_EXISTS) {
      alertPanel = (
        <Alert
          bsStyle="warning"
          onDismiss={this.handleAlertDismiss}
        >
          User already invited!
        </Alert>
      );
    } else if (alertStatus === USER_NOT_FOUND) {
      alertPanel = (
        <Alert
          bsStyle="danger"
          onDismiss={this.handleAlertDismiss}
        >
          User not found!
        </Alert>
      );
    }
    const project = this.props.project;
    let rootFolderName = 'Not yet selected';
    if (project.root_folder && project.directory_structure[0]) {
      rootFolderName = project.directory_structure[0].name;
    }

    let githubRepo = 'Not yet selected';
    const repoName = project.github_repo_name;
    const repoOwner = project.github_repo_owner;
    const repoSet = repoName && repoOwner;
    let githubCard = null;
    let selectNewRepoBtn = null;
    if (repoSet && !this.props.app.github.loading) {
      githubRepo = `${project.github_repo_owner}/${project.github_repo_name}`;
      selectNewRepoBtn = (
        <Button
          onClick={this.selectNewRepo}
          className="settings-btn"
        >
          Select new repository
        </Button>
      );
    } else {
      githubCard = (
        <Card initiallyExpanded>
          <CardHeader
            title="Enhance Collab's power with GitHub!"
            actAsExpander
            showExpandableButton
          />
          <CardText expandable>
            <Github
              project={this.props.project}
              actions={this.props.actions}
              app={this.props.app}
              repos={this.props.repos}
              authorize={this.authorize}
            />
          </CardText>
        </Card>
      );
    }
    let googlePanel = <LoadingIndicator className="loading-indicator-left" />;
    let githubPanel = <LoadingIndicator className="loading-indicator-left" />;
    if (!this.props.app.files.loading) {
      let style = {};
      if (project.folder_error) {
        rootFolderName = project.folder_error;
        style = { color: 'red' };
      }
      googlePanel = (
        <div>
          <span style={style}>
            <b>Root folder: {rootFolderName}</b>
          </span>
          <Button
            onClick={this.selectRootFolder}
            className="settings-btn"
          >
            Select new root folder
          </Button>
        </div>
      );
    }
    if (!this.props.app.github.loading) {
      let style = {};
      if (project.github_error) {
        githubRepo = project.github_error;
        style = { color: 'red' };
      }
      githubPanel = (
        <div>
          <span style={style}><b>Default repository: {githubRepo}</b></span>
          {selectNewRepoBtn}
          <br />
          <br />
          {githubCard}
        </div>
      );
    }
    if (!global.window.localStorage.github_token && repoSet) {
      // Repo set but not authorized
      githubPanel = (
        <div>
          <div style={{ color: 'red' }}>
            <b>Please re-authorize Github</b>
          </div>
          <br />
          <RaisedButton
            label="Authorize Github"
            onTouchTap={this.authorize}
            primary
            icon={<FontIcon className="fa fa-github" />}
          />
        </div>
      );
    }

    let chatName = 'None';
    if (project.chatroom) {
      chatName = project.chatroom;
    }
    const chatLabel = `Current chat room: ${chatName}`;
    return (
      <Paper style={styles.container}>
        <Card style={styles.panelContainer}>
          <CardHeader
            style={styles.panelHeader}
            titleColor="white"
            title="Members"
          />
          {listGroups}
          <div style={styles.panelContent}>
            {alertPanel}
            <form onSubmit={this.inviteMember}>
              <ControlLabel>Invite by email</ControlLabel>
              <InputGroup>
                <FormControl
                  type="email"
                  inputRef={ref => { this.addMemberInput = ref; }}
                  value={this.state.inputEmail}
                  onChange={this.handleChange}
                />
                <InputGroup.Button>
                  <Button type="submit">Invite member</Button>
                </InputGroup.Button>
              </InputGroup>
            </form>
          </div>
        </Card>
        <Card style={styles.panelContainer}>
          <CardHeader
            style={styles.panelHeader}
            titleColor="white"
            title="Google Integration"
          />
          <div style={styles.panelContent}>
            {googlePanel}
          </div>
        </Card>

        <Card style={styles.panelContainer}>
          <CardHeader
            style={styles.panelHeader}
            titleColor="white"
            title="GitHub Integration"
          />
          <div style={styles.panelContent}>
            {githubPanel}
          </div>
        </Card>

        <Card style={styles.panelContainer}>
          <CardHeader
            style={styles.panelHeader}
            titleColor="white"
            title="Chat Room"
          />
          <div style={styles.panelContent}>
            <form onSubmit={this.changeChatRoom}>
              <FormGroup>
                <ControlLabel>{chatLabel}</ControlLabel>
                <InputGroup>
                  <FormControl
                    type="text"
                    inputRef={ref => { this.chatNameInput = ref; }}
                    value={this.state.chatName}
                    placeholder="Chat room name"
                    onChange={this.chatNameChange}
                  />
                  <InputGroup.Button>
                    <Button type="submit">Join</Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </form>
          </div>
        </Card>
        <Card style={styles.panelContainer}>
          <CardHeader
            style={styles.panelHeader}
            titleColor="white"
            title="Options"
          />
          <div style={styles.panelContent}>
            <form onSubmit={this.renameProject}>
              <ControlLabel>
                {`Project name: ${this.props.project.content}`}
              </ControlLabel>
              <InputGroup>
                <FormControl
                  className="rename-project-input"
                  type="text"
                  inputRef={ref => { this.projectNameInput = ref; }}
                  value={this.state.inputProjectName}
                  placeholder="New project name"
                  onChange={this.projectNameChange}
                />
                <InputGroup.Button>
                  <Button type="submit" className="rename-project-btn">Rename</Button>
                </InputGroup.Button>
              </InputGroup>
            </form>
          </div>
        </Card>
      </Paper>
    );
  }
}

Settings.propTypes = propTypes;
export default Settings;
