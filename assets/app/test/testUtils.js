import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai'; // eslint-disable-line
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import deepFreeze from 'deep-freeze'; // eslint-disable-line
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import configureStore from 'redux-mock-store'; // eslint-disable-line

import FakeStore from './FakeStore.js';

const muiTheme = getMuiTheme();
const middlewares = [];
const mockStore = configureStore(middlewares);

export const mountWithFakeStore = (node) => mount(
  <MuiThemeProvider>
    <Provider store={mockStore(FakeStore)} children={node} />
  </MuiThemeProvider>
);

export const mountWithContext = (node) => (mount(node, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
}));

export const shallowWithContext = (node) => (
  shallow(node, {
    context: { muiTheme },
    childContextTypes: { muiTheme: React.PropTypes.object },
  })
);

export const debugWrapper = (wrapper) => {
  console.log(wrapper.debug()); // eslint-disable-line no-console
};

export const expectDeepEqual = (obj1, obj2) => {
  expect(obj1).to.deep.equal(obj2);
};

export const expectReducerBehavior = (reducer, stateBefore, action, expected) => {
  if (action) {
    deepFreeze(action);
  }
  if (stateBefore) {
    deepFreeze(stateBefore);
  }
  expectDeepEqual(reducer(stateBefore, action), expected);
};
