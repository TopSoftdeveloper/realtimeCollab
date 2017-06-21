import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import NotificationView from './../../js/containers/NotificationView.jsx';
import { mountWithFakeStore } from '../testUtils.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('NotificationView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(<NotificationView />);
    expect(wrapper).be.present();
  });
});
