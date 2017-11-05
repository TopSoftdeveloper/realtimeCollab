import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { browserHistory } from 'react-router';
import { Tabs, Tab } from 'material-ui/Tabs';
import Perf from 'react-addons-perf';

import ProjectMilestoneView from '../containers/ProjectMilestoneView.jsx';
import ProjectFileView from '../containers/ProjectFileView.jsx';
import ProjectNewsfeedView from '../containers/ProjectNewsfeedView.jsx';
import ProjectSettingView from '../containers/ProjectSettingView.jsx';
import ProjectMessageView from '../containers/ProjectMessageView.jsx';
import _404 from './Common/_404.jsx';
import { getCurrentTab, getProjectRoot } from '../utils/general';
import * as AppConstants from '../AppConstants';
import myTheme from '../myTheme.js';

const styles = {
  tabItemContainer: {
    height: 36,
  },
  tabButton: {
    height: 36,
    fontSize: 15,
  },
  tab: {
  },
  tabTemplate: {
    height: '100%',
  },
  tabs: {
    height: '',
  },
  projectTitleContanier: {
    textAlign: 'center',
    backgroundColor: myTheme.palette.primary1Color,
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
};
const propTypes = {
  // dispatch: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired,
  currentProject: PropTypes.object.isRequired,
  activeUsers: PropTypes.array.isRequired,
  pendingUsers: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

class Project extends Component {
  constructor(props, context) {
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.changeTabToMilestone = this.changeTab.bind(this, AppConstants.PATH.milestones);
    this.changeTabToFile = this.changeTab.bind(this, AppConstants.PATH.files);
    this.changeTabToDiscussion = this.changeTab.bind(this, AppConstants.PATH.discussions);
    this.changeTabToNewsfeed = this.changeTab.bind(this, AppConstants.PATH.newsfeed);
    this.changeTabToSetting = this.changeTab.bind(this, AppConstants.PATH.settings);
  }

  componentDidUpdate() {
    // Perf.stop();
    // Perf.printInclusive();
    // Perf.printWasted();
  }

  changeTab(newTab) {
    // Perf.start();
    browserHistory.push(`${getProjectRoot()}/${newTab}`);
  }
  render() {
    const { app, actions, activeUsers, pendingUsers, currentProject } = this.props;
    const currentProjectId = currentProject.id;
    if (!currentProject) {
      return <_404 />;
    }

    // Set the active tab
    let currentTab = getCurrentTab();
    if (currentTab === '') {
      // default tab
      currentTab = AppConstants.PATH.milestones;
    }

    // let repoName = currentProject.github_repo_name
    // let repoOwner = currentProject.github_repo_owner
    // let repoSet = repoName && repoOwner

    return (
      <div className="main-content">
        <Tabs
          style={styles.tabs}
          value={currentTab}
          contentContainerClassName="project-tabs full-height"
          className="full-height"
          tabTemplateStyle={styles.tabTemplate}
          tabItemContainerStyle={styles.tabItemContainer}
        >
          <Tab
            className="project-milestones-tab"
            buttonStyle={styles.tabButton}
            label="Milestones"
            value={AppConstants.PATH.milestones}
            onActive={this.changeTabToMilestone}
          >
            <ProjectMilestoneView
              projectId={currentProjectId}
              users={activeUsers}
              actions={actions}
            />
          </Tab>
          <Tab
            className="project-files-tab"
            buttonStyle={styles.tabButton}
            label="Files"
            value={AppConstants.PATH.files}
            onActive={this.changeTabToFile}
          >
            <ProjectFileView
              project={currentProject}
              actions={actions}
              app={app}
            />
          </Tab>
          <Tab
            className="project-discussions-tab"
            buttonStyle={styles.tabButton}
            label="Discussions"
            value={AppConstants.PATH.discussions}
            onActive={this.changeTabToDiscussion}
          >
            <ProjectMessageView
              showMilestoneSelector
            />
          </Tab>
          <Tab
            className="project-newsfeed-tab"
            buttonStyle={styles.tabButton}
            label="Newsfeed"
            value={AppConstants.PATH.newsfeed}
            onActive={this.changeTabToNewsfeed}
          >
            <ProjectNewsfeedView
              users={activeUsers}
            />
          </Tab>
          <Tab
            className="project-settings-tab"
            buttonStyle={styles.tabButton}
            label="Settings"
            value={AppConstants.PATH.settings}
            onActive={this.changeTabToSetting}
          >
            <ProjectSettingView
              project={currentProject}
              pendingUsers={pendingUsers}
              allActiveUsers={activeUsers}
              actions={actions}
              app={app}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

Project.propTypes = propTypes;

export default Project;
