import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import LoadingIndicator from './../../../js/components/Common/LoadingIndicator.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<LoadingIndicator {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('Snackbar.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('div');
    expect(wrapper).to.have.exactly(1).descendants('CircularProgress');
  };

  const props = {
    size: 29,
    className: 'happyClass happyClass2',
  };

  it('renders without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expectBasicStructure(wrapper);
  });
  describe('when it receives empty props', function () {
    const wrapper = shallowWrapperWithProps({});
    expectBasicStructure(wrapper);
    it('should have default size 40', function () {
      expect(wrapper.find('CircularProgress').first()).to.have.prop('size', 40);
    });
    it('should have default empty className', function () {
      expect(wrapper.find('div').first()).to.have.prop('className', '');
    });
  });
  describe('when it receives non-empty props', function () {
    const wrapper = shallowWrapperWithProps(props);
    expectBasicStructure(wrapper);
    it('should pass correct prop `size`', function () {
      expect(wrapper.find('CircularProgress').first()).to.have.prop('size', props.size);
    });
    it('should pass correct prop `className`', function () {
      expect(wrapper.find('div').first()).to.have.className(props.className);
    });
  });
});
