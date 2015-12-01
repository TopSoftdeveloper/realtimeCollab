import {isLoggedIn} from '../apiUtils/auth.js'
import App from '../containers/App.jsx'
import React from 'react'
import { Route } from 'react-router'

function redirectToLandingPage(nextState, replaceState) {
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
  <Route path='/app' component={App} onEnter={redirectToLandingPage}>
  </Route>
);