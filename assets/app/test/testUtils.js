import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai'; // eslint-disable-line
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import deepFreeze from 'deep-freeze'; // eslint-disable-line

const muiTheme = getMuiTheme();

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
