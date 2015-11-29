
import $ from 'jquery'
import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware} from 'redux'
import reducer from './reducers/index'
import thunk from 'redux-thunk'
import { Router, Route } from 'react-router'
import { syncReduxAndRouter } from 'redux-simple-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import App from './containers/App.jsx'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);
const history = createBrowserHistory()
let rootElement = document.getElementById('task-panel');

function run() {
    ReactDOM.render(
    	<Provider store={store}>
    		<Router history={history}>
    			<Route path='/app' component={App}>
      		</Route>
      	</Router>
      </Provider>,
      rootElement
    );
}

if (window.addEventListener) {
	window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}