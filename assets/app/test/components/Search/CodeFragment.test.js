import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import CodeFragment from './../../../js/components/Search/CodeFragment.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<CodeFragment {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('CodeFragment.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('pre');
    expect(wrapper).to.have.exactly(1).descendants('code');
  };
  const props = {
    fragment: 'routeManager\nimport mapper.mapper as mapper\n',
    matches: [
      {
        indices: [1, 2],
      },
    ],
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('static rendering', function () {
    const wrapper = shallowWrapperWithProps(props);
    expectBasicStructure(wrapper);
    it('should pass props of fragment and matches correctly`', function () {
      expect(wrapper).to.have.exactly(1).descendants('HighlightedCode');
      expect(wrapper.find('HighlightedCode')).to.have.prop('text', 'o');
    });
  });
});
