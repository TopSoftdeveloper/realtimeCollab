import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import ProjectMessageView from './../../js/containers/ProjectMessageView.jsx';
import { mountWithFakeStore } from '../testUtils.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('ProjectMessageView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(<ProjectMessageView />);
    expect(wrapper).be.present();
  });
});
