import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import SnackbarView from './../../js/containers/SnackbarView.jsx';
import { mountWithFakeStore } from '../testUtils.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('SnackbarView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(<SnackbarView />);
    expect(wrapper).be.present();
  });
});
