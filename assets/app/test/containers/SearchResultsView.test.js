import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import SearchResultsView from './../../js/containers/SearchResultsView.jsx';
import { mountWithFakeStore } from '../testUtils.js';

chai.use(chaiEnzyme());


/* eslint-disable func-names, prefer-arrow-callback */
describe('SearchResultsView.jsx', function () {
  it('render without explosion', function () {
    const wrapper = mountWithFakeStore(<SearchResultsView />);
    expect(wrapper).be.present();
  });
});
