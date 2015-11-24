
import $ from 'jquery';

import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import App from './containers/App.jsx';
import { createStore, applyMiddleware} from 'redux';
import reducer from './reducers/index';
import thunk from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

let rootElement = document.getElementById('task-panel');

// console.log(store.getState());

function run() {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        rootElement
    );
}

if (window.addEventListener) {
        //if (sessionStorage.getItem('jwt')) {
        //}
         //} else {
    //    window.location.replace('http://localhost:4000/');
    //}

    window.addEventListener('DOMContentLoaded', run);
} else {
    window.attachEvent('onload', run);
}