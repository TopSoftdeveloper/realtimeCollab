import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import configureStore from 'redux-mock-store';

import FakeStore from './../FakeStore.js';
import DashBoardView from './../../js/containers/DashboardView.jsx';


const middlewares = [];
const mockStore = configureStore(middlewares);

chai.use(chaiEnzyme());
const mountWithFakeStore = () => mount(
  <MuiThemeProvider>
    <Provider store={mockStore(FakeStore)}>
      <DashBoardView />
    </Provider>
  </MuiThemeProvider>
);

/* eslint-disable func-names, prefer-arrow-callback */
describe('DashBoardView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore();
    expect(wrapper).be.present();
  });
});
