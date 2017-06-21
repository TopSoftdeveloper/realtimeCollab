import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import DashboardView from './../../js/containers/DashboardView.jsx';
import { mountWithFakeStore } from '../testUtils.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('DashboardView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(<DashboardView />);
    expect(wrapper).be.present();
  });
});
