import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import ProjectMilestoneView from './../../js/containers/ProjectMilestoneView.jsx';
import { mountWithFakeStore } from '../testUtils.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('ProjectMilestoneView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(<ProjectMilestoneView users={[]} />);
    expect(wrapper).be.present();
  });
});
