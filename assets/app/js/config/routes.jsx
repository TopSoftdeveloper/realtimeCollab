import React from 'react'
import { Route } from 'react-router'
import {isLoggedIn} from '../apiUtils/auth.js'
import App from '../containers/App.jsx'
import Project from '../components/Project.jsx'

function requireLogin(nextState, replaceState) {
  if (!isLoggedIn()) {
    window.location.assign('http://localhost:4000');
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