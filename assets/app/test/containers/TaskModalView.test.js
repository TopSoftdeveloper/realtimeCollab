import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import TaskModalView from './../../js/containers/TaskModalView.jsx';
import { mountWithFakeStore } from '../testUtils.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('TaskModalView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(<TaskModalView />);
    expect(wrapper).be.present();
  });
});
