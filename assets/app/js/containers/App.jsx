import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sidebar from 'react-sidebar';
import { Grid, Row } from 'react-bootstrap';
import assign from 'object-assign';

import { Color } from '../myTheme.js';
import * as Actions from '../actions/ReduxTaskActions';
import * as SocketActions from '../actions/SocketActions';
import Header from '../components/Header.jsx';
import { matchesUrl, getCurrentProject } from '../utils/general';
import { isProjectPresent } from '../utils/collection';
import LeftPanel from '../components/LeftPanel.jsx';
import LoadingIndicator from '../components/Common/LoadingIndicator.jsx';
import SnackbarView from './SnackbarView.jsx';
import { refreshTokens } from '../utils/apiUtil';
import { APP_ROOT_URL } from '../AppConstants.js';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  projects: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  app: PropTypes.object.isRequired,
  search: PropTypes.array.isRequired,
  socketActions: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired,
};

const styles = {
  floatingSidebarIconContainer: {
    position: 'fixed',
    top: 80,
    left: 195,
    backgroundColor: Color.leftPanelBackgroundColor,
  },
  floatingSidebarIcon: {
    color: 'white',
    fontSize: 20,
    lineHeight: 'inherit',
  },
  sidebar: {
    backgroundColor: Color.leftPanelBackgroundColor,
    color: 'white',
    width: 200,
    maxWidth: 200,
  },
};
/* global  window  localStorage */
class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.initApp();
    const { socketActions } = this.props;
    socketActions.userIsOnline();
    socketActions.monitorOnlineStatus();
    socketActions.monitorProjectChanges();
    socketActions.monitorNotifications();
    socketActions.monitorEditStatus();
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }
  getChildContext() {
    return {
      location: this.props.location,
    };
  }
  shouldComponentUpdate() {
    const { projects } = this.props;
    if (matchesUrl(window.location.href, APP_ROOT_URL) && projects.length > 0) {
      // Redirect to default project (current set as project at index 0)
      // let defaultProjectId = projects[0].id;
      // browserHistory.push('/app/project/' + defaultProjectId);
      return false;
    }
    return true;
  }
  initApp() {
    this.props.dispatch(Actions.initializeApp());
    this.autoRefreshTokens();
  }

  checkTokenExpiry() {
    const thresholdMs = 600000; // 10 mins
    if (localStorage.expiry_date - new Date().getTime() < thresholdMs) {
      refreshTokens().done(res => {
        localStorage.setItem('google_token', res.access_token);
        localStorage.setItem('expiry_date', new Date().getTime() + (res.expires_in * 1000));
      }).fail(e => {
        console.warn(e);
      });
    }
  }

  autoRefreshTokens() {
    const checkingIntervalMs = 300000; // 5 mins
    setInterval(this.checkTokenExpiry, checkingIntervalMs);
  }
  toggleSidebar() {
    this.props.actions.setSidebarVisibility(!this.props.app.showSidebar);
  }
  renderMainContent() {
    const { app, projects } = this.props;
    let children = this.props.children;
    if (projects.length === 0 && matchesUrl(window.location.href, APP_ROOT_URL) && !app.loading) {
      children = (
        <div className="main-content">
          <div className="no-items">
            <h3>You have no projects yet!</h3>
            <p>Add one to get started</p>
          </div>
        </div>
      );
    }
    if (app.loading) {
      children = (
        <div className="main-content">
          <LoadingIndicator className="loading-indicator" />
        </div>
      );
    }
    return children;
  }
  render() {
    const { notifications, projects, users, app, search, actions } = this.props;
    let currentProject = null;
    const currentProjectId = getCurrentProject();

    if (users.length === 0) {
      // First initialization of app
      return <div className="main-content" />;
    }
    const displayName = users.filter(user =>
      user.id === localStorage.getItem('user_id')
    )[0].display_name;
    const unreadCount = notifications.reduce((total, notif) => (notif.read ? total : total + 1), 0);

    if (isProjectPresent(projects, currentProjectId)) {
      currentProject = projects.filter(proj => proj.id === currentProjectId)[0];
    }
    return (
      <Grid>
        <Row>
          <Header
            unreadCount={unreadCount}
            projects={projects}
            displayName={displayName}
            search={search}
            actions={actions}
            app={app}
          />
          <Sidebar
            shadow={false}
            transitions={false}
            docked
            open
            styles={{
              sidebar: assign({}, styles.sidebar, !this.props.app.showSidebar && {
                display: 'none',
              }),
            }}
            sidebar={
              <LeftPanel
                currentProject={currentProject}
                projects={projects}
                actions={actions}
                onCreateProject={actions.createProject}
              />
            }
          >
            <div className="body-wrapper">
              <div
                style={
                  assign({}, styles.floatingSidebarIconContainer, !this.props.app.showSidebar && {
                    left: 0,
                  })
                }
                onClick={this.toggleSidebar}
              >
                <i
                  style={styles.floatingSidebarIcon}
                  className="material-icons"
                >
                  {this.props.app.showSidebar ? 'keyboard_arrow_left' : 'keyboard_arrow_right'}
                </i>
              </div>
              {this.renderMainContent()}
            </div>
          </Sidebar>
          <SnackbarView />
        </Row>
      </Grid>
    );
  }
}

App.propTypes = propTypes;
App.childContextTypes = {
  location: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  notifications: state.notifications,
  projects: state.projects,
  users: state.users,
  app: state.app,
  search: state.search,
});
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Actions, dispatch),
  socketActions: bindActionCreators(SocketActions, dispatch),
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
