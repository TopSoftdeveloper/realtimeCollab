import React from 'react'
import { Route } from 'react-router'
import {isLoggedIn} from '../utils/auth.js'
import App from '../containers/App.jsx'
import Project from '../components/Project.jsx'
let AppConstants = require('../AppConstants');

function requireLogin(nextState, replaceState) {
  if (!isLoggedIn()) {
    window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
  }
}

function redirectToDashboard(nextState, replaceState) {
  if (isLoggedIn()) {
    replaceState(null, '/app')
  }
}

export default (
  <Route path='/app' component={App} onEnter={requireLogin}>
    <Route>
      <Route path='project/:id' component={Project}/>
    </Route>
  </Route>
);