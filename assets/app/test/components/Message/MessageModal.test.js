import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MessageModal from './../../../js/components/Message/MessageModal.jsx';

chai.use(chaiEnzyme());

const muiTheme = getMuiTheme();
const mountWrapperWithProps = (props) => mount(<MessageModal {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});

/* eslint-disable func-names, prefer-arrow-callback */
describe('MessageModal.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('Tabs');
    expect(wrapper).to.have.exactly(2).descendants('Tab');
    expect(wrapper).to.have.descendants('FlatButton');
  };
  const props = {
    contentValue: '',
    onSubmitMethod: sinon.spy(),
    onCloseMethod: sinon.spy(),
    inputStyle: {},
  };

  it('render without explosion', function () {
    const wrapper = mountWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('render with different props', function () {
    const wrapper = mountWrapperWithProps(props);
    it('should not render cancel button if onCloseMethod is null', function () {
      wrapper.setProps({ onCloseMethod: null });
      expect(wrapper).to.have.exactly(1).descendants('FlatButton');
    });
    it('should render cancel button if onCloseMethod is not null', function () {
      wrapper.setProps({ onCloseMethod: sinon.spy() });
      expect(wrapper).to.have.exactly(2).descendants('FlatButton');
    });
    it('should pass inputStyle method correctly', function () {
      wrapper.setProps({ inputStyle: { color: 'white' } });
      expect(wrapper.find('FormControl')).to.have.style('color', 'white');
    });
    it('should set state `inputText` by the prop `contentValue`', function () {
      wrapper.setProps({ contentValue: 'sample' });
      expect(wrapper).to.have.state('inputText').equal('sample');
    });
  });
  describe('for various interactions', function () {
    const wrapper = mountWrapperWithProps(props);
    const onSubmitMethodMock = sinon.spy();
    const onCloseMethodMock = sinon.spy();
    wrapper.setProps({
      onSubmitMethod: onSubmitMethodMock,
      onCloseMethod: onCloseMethodMock,
    });
    beforeEach('reset mock', function () {
      onSubmitMethodMock.reset();
      onCloseMethodMock.reset();
    });
    it('should disable submit button if submit button clicked and state `inputText` is non-empty',
    function () {
      wrapper.setState({ inputText: 'non-empty' });
      const submitButtonWrapper = wrapper.find('FlatButton').at(1);
      expect(submitButtonWrapper).to.have.prop('disabled', false);
      submitButtonWrapper.simulate('touchTap');
      expect(onSubmitMethodMock.calledOnce).to.equal(true);
    });
    it('should call onSubmitMethodMock if submit button clicked and state `inputText` is non-empty',
    function () {
      wrapper.setState({ inputText: '' });
      const acceptButtonWrapper = wrapper.find('FlatButton').at(1);
      expect(acceptButtonWrapper).to.have.prop('disabled', true);
    });
    it('should call onCloseMethodMock button if cancel button clicked',
    function () {
      wrapper.setState({ inputText: 'non-empty' });
      const cancelButtonWrapper = wrapper.find('FlatButton').first();
      cancelButtonWrapper.simulate('touchTap');
      cancelButtonWrapper.simulate('click');
      expect(onCloseMethodMock.calledOnce).to.equal(true);
    });
  });
});
