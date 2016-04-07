import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import * as Actions from '../actions/ReduxTaskActions'
import * as SocketActions from '../actions/SocketActions'
import Header from '../components/Header.jsx'
import {matchesUrl, getCurrentProject, isItemPresent} from '../utils/general'
import {isProjectPresent} from '../utils/collection'
import LeftPanel from '../components/LeftPanel.jsx'
import { Grid, Row, Col } from 'react-bootstrap'
import Sidebar from 'react-sidebar'
import LoadingIndicator from '../components/LoadingIndicator.jsx'
import Snackbar from 'material-ui/lib/snackbar';
import {_updateAppStatus}  from '../actions/ReduxTaskActions'
import {refreshTokens} from '../utils/apiUtil'

var AppConstants = require('../AppConstants');

class App extends Component {
    constructor(props, context) {
        super(props, context)
        this.initApp()
        const {dispatch} = this.props;
        const socketActions = bindActionCreators(SocketActions, dispatch);
        const actions = bindActionCreators(Actions, dispatch);
        socketActions.userIsOnline()
        socketActions.monitorOnlineStatus()
        socketActions.monitorProjectChanges()
        socketActions.monitorNotifications()
        socketActions.monitorEditStatus()
    }

    initApp() {
        this.props.dispatch(Actions.initializeApp())
        this.autoRefreshTokens()
    }

    checkTokenExpiry() {
        const threshold_ms = 600000 // 10 mins
        if (localStorage.expiry_date - new Date().getTime() < threshold_ms){
            refreshTokens().done(res => {
                localStorage.setItem('google_token', res.access_token);
                localStorage.setItem('expiry_date', res.expires_in * 1000 + new Date().getTime());
            }).fail(e => {
                console.log(e);
            });
        }
    }

    autoRefreshTokens() {
        const checkingInterval_ms = 300000 // 5 mins
        setInterval(this.checkTokenExpiry, checkingInterval_ms)
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { projects } = this.props;
        if (matchesUrl(window.location.href, AppConstants.APP_ROOT_URL) && projects.length > 0) {
            // Redirect to default project (current set as project at index 0)
            let defaultProjectId = projects[0].id;
            browserHistory.push('/app/project/' + defaultProjectId);
            return false;         
        }
        return true;
    }

    handleSnackbarClose() {
        let dispatch = this.props.dispatch
        dispatch(_updateAppStatus({snackbar: {isOpen: false, message: ''}}))
    }

    render() {
        const {notifications, projects, users, dispatch, app, files, search} = this.props;
        const actions = bindActionCreators(Actions, dispatch);
        const currentProjectId = getCurrentProject()

        let basicUsers = [];
        let projectCreator = '';
        let currentProject = null

        if (users.length === 0) {
            // First initialization of app
            return (<div className='main-content'></div>);
        }

        let children = this.props.children;
        if (projects.length === 0 && matchesUrl(window.location.href, AppConstants.APP_ROOT_URL) && !app.loading) {
            children = (
                <div className='main-content'>
                    <div className="no-items">
                        <h3>You have no projects yet!</h3>
                        <p>Add one to get started</p>
                    </div>
                </div>
            )
        }

        if (app.loading) {
            children = (
                <div className='main-content'>
                    <LoadingIndicator className="loading-indicator"/>
                </div>
            )
        }

        let displayName = users.filter(
            user => user.id === localStorage.getItem('user_id'))[0].display_name;

        let unreadCount = notifications.reduce((total, notif) => notif.read ? total : total+1, 0);

        if (isProjectPresent(projects, currentProjectId)) {
            currentProject = projects.filter(proj => proj.id === currentProjectId)[0];
            let basicUserIds = currentProject.basic;

            projectCreator = users.filter(user  => currentProject.creator === user.id)[0];
            basicUsers = users.filter(user => isItemPresent(basicUserIds, user.id));
        }
        let allActiveUsers = basicUsers
        if (projectCreator) allActiveUsers.push(projectCreator)

        return (
            <div>
                <Sidebar
                    sidebarClassName="left-panel"
                    sidebar={
                     <LeftPanel
                        currentProject={currentProject}
                        projects={projects}
                        app={app}
                        files={files}
                        actions={actions}
                        onCreateProject={actions.createProject}
                      />
                    }
                    open={true}
                    docked={true}>
                    <Header
                        unreadCount={unreadCount}
                        projects={projects}
                        displayName={displayName}
                        search={search}
                        actions={actions}
                        app={app}
                    />
                    <div className="body-wrapper">
                        {children}
                    </div>
                </Sidebar>
                <Snackbar
                    open={app.snackbar.isOpen}
                    message={app.snackbar.message}
                    autoHideDuration={5000}
                    bodyStyle={{background: app.snackbar.background}}
                    onRequestClose={this.handleSnackbarClose.bind(this)}
                />
            </div>
        );
    }
}



App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    files: PropTypes.array.isRequired,
    app: PropTypes.object.isRequired,
    search: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        notifications: state.notifications,
        projects: state.projects,
        users: state.users,
        files: state.files,
        app: state.app,
        search: state.search
    };
}

export default connect(mapStateToProps)(App)