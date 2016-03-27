import React from 'react'
import { Route } from 'react-router'
import {isLoggedIn} from '../utils/auth.js'
import App from '../containers/App.jsx'
import Project from '../components/Project.jsx'
import _404 from '../components/_404.jsx'
import Notifications from '../components/Notifications.jsx'

let AppConstants = require('../AppConstants');

function requireLogin(nextState, replaceState) {
    isLoggedIn().done(function(res) {
        if (res.aud !== AppConstants.GOOGLE_CLIENT_ID) {
            window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
        }
    }).fail(function(res) {
        window.location.assign(AppConstants.LANDING_PAGE_ROOT_URL);
    })
}

function redirectToDashboard(nextState, replaceState) {
    isLoggedIn().done(function(res) {
        replaceState(null, '/app')
    })
}

export default (
    <Route path='/app' component={App} onEnter={requireLogin}>
        <Route>
            <Route path='project/:id' component={Project}>
                <Route path={AppConstants.PATH.milestones} />
                <Route path={AppConstants.PATH.files} />
                <Route path={AppConstants.PATH.newsfeed} />
                <Route path={AppConstants.PATH.settings} />
            </Route>
            <Route path='notifications' component={Notifications}/>
            <Route path='*' component={_404}/>
        </Route>
    </Route>
);