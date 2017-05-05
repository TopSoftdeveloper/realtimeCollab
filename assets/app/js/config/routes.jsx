import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import AppView from '../containers/AppView.jsx';
import ProjectView from '../containers/ProjectView.jsx';
import _404 from '../components/Common/_404.jsx';
import NotificationView from '../containers/NotificationView.jsx';
import SearchResultsView from '../containers/SearchResultsView.jsx';
import DashboardView from '../containers/DashboardView.jsx';
import * as AppConstants from '../AppConstants';

export default (
  <Route path="/app" component={AppView}>
    <IndexRedirect to="dashboard" />
    <Route path="project/:id" component={ProjectView}>
      <Route path={AppConstants.PATH.milestones} />
      <Route path={AppConstants.PATH.files} />
      <Route path={AppConstants.PATH.newsfeed} />
      <Route path={AppConstants.PATH.settings} />
      <Route path={AppConstants.PATH.discussions} />
    </Route>
    <Route path="notifications" component={NotificationView} />
    <Route path="search" component={SearchResultsView} />
    <Route path="dashboard" component={DashboardView} />
    <Route path="*" component={_404} />
  </Route>
);
