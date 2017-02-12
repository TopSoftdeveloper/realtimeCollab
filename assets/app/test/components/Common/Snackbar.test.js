import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import Snackbar from './../../../js/components/Common/Snackbar.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<Snackbar {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('Snackbar.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('Snackbar');
  };

  const props = {
    snackbar: {
      isOpen: false,
      message: 'special thanks to you',
      background: 'white',
    },
    onRequestClose: sinon.spy(),
  };

  it('renders without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expectBasicStructure(wrapper);
  });
  describe('when it receives non-empty props', function () {
    const wrapper = shallowWrapperWithProps(props);
    expectBasicStructure(wrapper);
    it('should pass correct prop `snackbar`', function () {
      expect(wrapper.find('Snackbar').first()).to.have.props(['open', 'message', 'bodyStyle'])
        .deep.equal([
          props.snackbar.isOpen,
          props.snackbar.message,
          {
            background: props.snackbar.background,
          },
        ]);
    });
  });
});
