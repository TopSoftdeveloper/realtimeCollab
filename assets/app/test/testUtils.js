import React from 'react';
import {shallow, mount} from 'enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme();

export const mountWithContext = (node) => {
  return mount(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: React.PropTypes.object},
  })
};

export const shallowWithContext = (node) => {
  return shallow(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: React.PropTypes.object},
  })
};
