import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose} from 'redux'
import reducer from './reducers/index'
import thunk from 'redux-thunk'
import { Router } from 'react-router'
import { browserHistory } from 'react-router'
import routes from './config/routes.jsx'
let injectTapEventPlugin = require("react-tap-event-plugin")
injectTapEventPlugin()


// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
// const store = createStoreWithMiddleware(reducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))


let rootElement = document.getElementById('task-panel');

function run() {
    ReactDOM.render(
    	<Provider store={store}>
    		<Router history={browserHistory} routes={routes} />
      </Provider>,
      rootElement
    );
}

if (window.addEventListener) {
	window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}
