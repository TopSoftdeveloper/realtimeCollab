import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import ProjectNewsfeedView from './../../js/containers/ProjectNewsfeedView.jsx';
import { mountWithFakeStore } from '../testUtils.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('ProjectNewsfeedView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(<ProjectNewsfeedView />);
    expect(wrapper).be.present();
  });
});
