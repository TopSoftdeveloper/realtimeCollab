import React from 'react'
import {Route, IndexRoute, IndexRedirect} from 'react-router'
import App from '../containers/App.jsx'
import Project from '../containers/Project.jsx'
import _404 from '../components/_404.jsx'
import Notifications from '../components/Notifications.jsx'
import SearchResults from '../components/SearchResults.jsx'
import Dashboard from '../components/Dashboard.jsx'
import * as AppConstants from '../AppConstants';


export default (
  <Route path='/app' component={App}>
    <IndexRedirect to="dashboard" />>
    <Route path='project/:id' component={Project}>
      // <Route path={AppConstants.PATH.milestones} />
      // <Route path={AppConstants.PATH.files} />
      // <Route path={AppConstants.PATH.newsfeed} />
      // <Route path={AppConstants.PATH.settings} />
    </Route>
    <Route path='notifications' component={Notifications}/>
    <Route path='search' component={SearchResults}/>
    <Route path='dashboard' component={Dashboard}/>
    <Route path='*' component={_404}/>

  </Route>
);
