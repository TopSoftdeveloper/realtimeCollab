import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware} from 'redux'
import reducer from './reducers/index'
import thunk from 'redux-thunk'
import { Router } from 'react-router'
import { syncReduxAndRouter } from 'redux-simple-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import routes from './config/routes.jsx'
let injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin()

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);
const history = createBrowserHistory()
let rootElement = document.getElementById('task-panel');

function run() {
    ReactDOM.render(
    	<Provider store={store}>
    		<Router history={history} routes={routes} />
      </Provider>,
      rootElement
    );
}

if (window.addEventListener) {
	window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}