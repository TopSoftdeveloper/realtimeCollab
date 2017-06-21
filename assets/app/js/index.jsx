import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Router, browserHistory } from 'react-router';
import ReactGA from 'react-ga';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';

import routes from './config/routes.jsx';
import reducer from './reducers/index';
import myTheme from './myTheme.js';

injectTapEventPlugin();


// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
// const store = createStoreWithMiddleware(reducer);

/* global window document */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

const rootElement = document.getElementById('task-panel');

ReactGA.initialize('UA-84478427-2');
const logPage = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

function run() {
  ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme(myTheme)} >
      <Provider store={store}>
        <Router history={browserHistory} routes={routes} onUpdate={logPage} />
      </Provider>
    </MuiThemeProvider>,
    rootElement
  );
}

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}
