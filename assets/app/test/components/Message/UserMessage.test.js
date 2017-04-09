import React from 'react';
import chai, { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import assign from 'object-assign';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import UserMessage from './../../../js/components/Message/UserMessage.jsx';
import { Color } from './../../../js/myTheme.js';
import { mountWithContext } from '../../testUtils.js';

chai.use(chaiEnzyme());

const muiTheme = getMuiTheme();
const shallowWrapperWithProps = (props) => shallow(<UserMessage {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});
const mountWrapperWithProps = (props) => mount(<UserMessage {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});

/* eslint-disable func-names, prefer-arrow-callback */
describe('UserMessage.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('Row');
    expect(wrapper).to.have.exactly(2).descendants('Col');
    expect(wrapper).to.have.exactly(1).descendants('UserAvatar');
  };
  const props = {
    message: {
      id: '1',
      pinned: false,
      content: '**sample message**',
      createdAt: '2017-04-05T09:23:22.000Z',
      updatedAt: '2017-04-05T09:23:22.000Z',
      authorName: 'JJ Zhang',
      authorAvatarUrl: 'www.google.com/profile/sjadklj3241',
    },
    onPinMessage: sinon.spy(),
    onUnpinMessage: sinon.spy(),
    onEditMessageContent: sinon.spy(),
    onDeleteMessage: sinon.spy(),
    onEnterEditMode: sinon.spy(),
    pinned: false,
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('static rendering if given message is pinned', function () {
    const wrapper = mountWrapperWithProps(props);
    wrapper.setProps({ message: assign(props.message, { pinned: true }) });
    expectBasicStructure(wrapper);
    it('should render with a higlighted left boreder if the message is pinned`', function () {
      expect(wrapper.find('Row').prop('style').borderLeft)
        .equal('2px solid rgb(254, 209, 45)');
    });
    it('should render with a differnet backgroundColor if inside pinned list`', function () {
      wrapper.setProps({ pinned: true });
      expect(wrapper.find('Row').prop('style').backgroundColor)
        .equal(Color.messageViewPinBackgroundColor);
    });
  });

  describe.skip('for various interaction', function () {
    const wrapper = mountWrapperWithProps(props);
    const getRenderToLayerWrapper = (rWrapper) => {
      const renderToLayer = rWrapper.find('RenderToLayer').first();
      // console.log(renderToLayer);
      const renderToLayerWrapper = mountWithContext(renderToLayer.prop('render')());
      // const renderToLayerWrapper = renderToLayer.mount()
      // debugWrapper(renderToLayerWrapper);
      return renderToLayerWrapper;
    };
    const onPinMessageMock = sinon.spy();
    const onUnpinMessageMock = sinon.spy();
    wrapper.setProps({
      onPinMessage: onPinMessageMock,
      onUnpinMessage: onUnpinMessageMock,
    });
    beforeEach('reset dispatchMock', function () {
      onPinMessageMock.reset();
      onUnpinMessageMock.reset();
    });
    it('should trigger onPinMessageMock when pin option button is clicked', function () {
      expectBasicStructure(wrapper);
      const popoverWrapper = getRenderToLayerWrapper(wrapper);
      // console.log(popoverWrapper.debug());
      const acceptButtonWrapper = popoverWrapper.find('MenuItem').first();
      acceptButtonWrapper.simulate('click');
      acceptButtonWrapper.simulate('touchTap');
      // expect(onPinMessageMock.calledOnce).to.equal(true);
      expect(onUnpinMessageMock.calledOnce).to.equal(true);
    });
  });
});
