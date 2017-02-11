import React from 'react';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import _404 from './../../../js/components/Common/_404.jsx';

chai.use(chaiEnzyme());
/* eslint-disable func-names, prefer-arrow-callback */
describe('_404.jsx', function () {
  const wrapper = shallow(<_404 />);
  it('renders without explosion', function () {
    expect(wrapper).to.be.present();
  });

  it('renders with structure', function () {
    expect(wrapper.contains(<div><h1>404</h1></div>)).to.equal(true);
  });


  it('contains one <h1> tag', function () {
    expect(wrapper.find('h1')).to.have.length(1);
  });

  it('text is 404', function () {
    expect(wrapper.text()).to.equal('404');
  });
});
