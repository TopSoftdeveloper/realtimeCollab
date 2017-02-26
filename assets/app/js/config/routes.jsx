import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from '../containers/App.jsx';
import Project from '../containers/Project.jsx';
import _404 from '../components/Common/_404.jsx';
import NotificationView from '../containers/NotificationView.jsx';
import SearchResults from '../components/Search/SearchResults.jsx';
import DashboardView from '../containers/DashboardView.jsx';
import * as AppConstants from '../AppConstants';

export default (
  <Route path="/app" component={App}>
    <IndexRedirect to="dashboard" />>
    <Route path="project/:id" component={Project}>
      <Route path={AppConstants.PATH.milestones} />
      <Route path={AppConstants.PATH.files} />
      <Route path={AppConstants.PATH.newsfeed} />
      <Route path={AppConstants.PATH.settings} />
    </Route>
    <Route path="notifications" component={NotificationView} />
    <Route path="search" component={SearchResults} />
    <Route path="dashboard" component={DashboardView} />
    <Route path="*" component={_404} />
  </Route>
);
