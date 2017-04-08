import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import ClippedText from './../../../js/components/Common/ClippedText.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<ClippedText {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('ClippedText.jsx', function () {
  const props = {
    text: 'this is a sample text',
    limit: 10,
  };

  it('renders without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
  });
  describe('its default props', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should show tooltip at right', function () {
      expect(wrapper.find('OverlayTrigger')).to.have.prop('placement', 'right');
    });
    it('should trim text with `...`` inidcator', function () {
      expect(wrapper.find('span')).to.have.text('this is...');
    });
  });
  describe('render with correct props', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should pass correct textStyle', function () {
      const newProps = {
        color: 'red',
      };
      wrapper.setProps({ textStyle: newProps });
      expect(wrapper.find('span')).to.have.style('color', 'red');
    });
    it('should pass correct placement', function () {
      wrapper.setProps({ placement: 'top' });
      expect(wrapper.find('OverlayTrigger')).to.have.prop('placement', 'top');
    });
    it('should not render tooltip if `showToolTip` is false', function () {
      wrapper.setProps({ showToolTip: false });
      expect(wrapper).to.not.have.descendants('OverlayTrigger');
    });
    it('should render correct indicator', function () {
      wrapper.setProps({ indicator: '' });
      expect(wrapper.find('span')).to.have.text('this is a ');
    });
  });
  describe('when text does not reach limit', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ limit: 30 });
    it('should not render tooltip', function () {
      expect(wrapper).to.not.have.descendants('OverlayTrigger');
    });
    it('should render full text', function () {
      expect(wrapper.find('span')).to.have.text(props.text);
    });
  });
  describe('when text is null', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should not crush', function () {
      wrapper.setProps({ text: null });
      expect(wrapper).be.present();
    });
  });
});
