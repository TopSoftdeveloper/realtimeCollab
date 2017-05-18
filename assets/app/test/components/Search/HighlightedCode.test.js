import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import HighlightedCode from './../../../js/components/Search/HighlightedCode.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<HighlightedCode {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('HighlightedCode.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('code');
    expect(wrapper.find('code')).to.have.className('highlight-yellow');
  };
  const props = {
    text: 'routeManager import mapper.mapper as mapper',
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('static rendering', function () {
    const wrapper = shallowWrapperWithProps(props);
    expectBasicStructure(wrapper);
    it('should pass props of text correctly`', function () {
      expect(wrapper.find('code')).to.have.text(props.text);
    });
  });
});
