import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import FlatButton from 'material-ui/FlatButton';

import { mountWithContext } from '../../testUtils.js';
import RenameModal from './../../../js/components/File/RenameModal.jsx';

chai.use(chaiEnzyme());

/* eslint-disable func-names, prefer-arrow-callback */
describe('RenameModal.jsx ', function () {
  const props = {
    handleClose: sinon.spy(),
    onDialogSubmit: sinon.spy(),
    inputValue: 'dummyName',
  };
  describe('render without explosion and static testing', function () {
    const wrapper = shallow(<RenameModal {...props} />);
    it('renders exactly one Dialog', function () {
      expect(wrapper).to.have.exactly(1).descendants('Dialog');
    });
    it('renders exactly one Form ', function () {
      expect(wrapper).to.have.exactly(1).descendants('Formsy');
    });
    it('renders exactly one FormsyText and the value is equal to inputValue ', function () {
      expect(wrapper).to.have.exactly(1).descendants('FormsyText');
      expect(wrapper.find('FormsyText').first()).to.have.props({ value: props.inputValue });
    });
    it('has intial state of canSubmit to be false', function () {
      expect(wrapper).to.have.state('canSubmit').equal(false);
    });
  });
  describe('renders inner components correctly', function () {
    const wrapper = mountWithContext(<RenameModal {...props} />);
    const renderToLayer = wrapper.find('RenderToLayer').first();
    // console.log(renderToLayer);
    const renderToLayerWrapper = mountWithContext(renderToLayer.prop('render')());
    it('renders two action buttons, first is cancel, second is Submit', function () {
      expect(renderToLayerWrapper.find(FlatButton).first()).to.have.prop('label', 'Cancel');
      expect(renderToLayerWrapper.find(FlatButton).at(1)).to.have.prop('label', 'Submit');
    });
  });
  // TODO unresolved issue on renderToLayer
  describe.skip('should behaves correct when form submission is invalid', function () {
    const wrapper = shallow(<RenameModal {...props} />);

    beforeEach('method mocking and reset', function () {
      // props.handleClose.reset();
      // props.onDialogSubmit.reset();
      this.onDialogSubmitMock = sinon.spy(wrapper.instance(), 'onDialogSubmit');
      this.enableButtonMock = sinon.spy(wrapper.instance(), 'enableButton');
      this.disableButtonMock = sinon.spy(wrapper.instance(), 'disableButton');
      wrapper.update();
    });
    wrapper.first().simulate('submit');
    // wrapper.find({label:'Submit'}).first().simulate('touchTap');
    it('should tigger the `onInvalid` callback to disable the button', function () {
      expect(this.onDialogSubmitMock.calledOnce).to.equal(true);
    });
  });
});
