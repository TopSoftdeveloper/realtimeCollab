import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import ProjectView from './../../js/containers/ProjectView.jsx';
import { mountWithFakeStore } from '../testUtils.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('ProjectView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(<ProjectView />);
    expect(wrapper).be.present();
  });
});
