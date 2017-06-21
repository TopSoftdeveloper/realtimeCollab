import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import ProjectSettingView from './../../js/containers/ProjectSettingView.jsx';
import { mountWithFakeStore } from '../testUtils.js';
import FakeStore from './../FakeStore.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('ProjectSettingView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(
      <ProjectSettingView
        allActiveUsers={[]}
        pendingUsers={[]}
        project={FakeStore.projects[0]}
        app={FakeStore.app}
      />);
    expect(wrapper).be.present();
  });
});
