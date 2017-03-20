import React from 'react';
import chai, { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import assign from 'object-assign';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import NotificationItem from './../../../js/components/Notification/NotificationItem.jsx';
import { toFuzzyTime } from './../../../js/utils/general';
import { Color } from './../../../js/myTheme.js';

chai.use(chaiEnzyme());

const muiTheme = getMuiTheme();
const shallowWrapperWithProps = (props) => shallow(<NotificationItem {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});
const mountWrapperWithProps = (props) => mount(<NotificationItem {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});

/* eslint-disable func-names, prefer-arrow-callback */
describe('NotificationItem.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('Card');
    expect(wrapper).to.have.exactly(1).descendants('CardHeader');
    expect(wrapper).to.have.exactly(1).descendants('Divider');
  };
  const props = {
    notification: {
      text: 'You have a new message',
      read: false,
      time: '2017-02-10T15:51:51.000Z',
      type: 'JOINED_PROJECT',
      meta: {
        project_id: 'sdfal213',
      },
    },
    user: {
      id: 'EkD69ORwf',
      email: 'zhangji951027@gmail.com',
      display_name: 'JJ Zhang',
      display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
      online: true,
      colour: '#03a9f4',
      me: true,
    },
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('static rendering with user and actionButtons to be null', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ user: null });
    expectBasicStructure(wrapper);
    it('should pass props of text and time correctly`', function () {
      expect(wrapper.find('CardHeader')).to.have.prop('title', props.notification.text);
      expect(wrapper.find('CardHeader')).to.have.prop('subtitle',
        toFuzzyTime(props.notification.time));
    });
    it('should render null Avatar', function () {
      expect(wrapper.find('Card').prop('avatar')).equal(undefined);
    });
  });
  describe('static rendering with user', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should render <Avatar>', function () {
      expectBasicStructure(wrapper);
      expect(wrapper.find('CardHeader')).to.have.prop('avatar');
    });
    it('should pass correct props to <Avatar>', function () {
      expect(wrapper.find('CardHeader').prop('avatar').props.src).equal(props.user.display_image);
    });
  });
  describe('for different prop `read`', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should have white background color for read notification', function () {
      wrapper.setProps({ notification: assign(props.notification, { read: false }) });
      expectBasicStructure(wrapper);
      expect(wrapper.find('Card').prop('style').backgroundColor).equal(Color.highlightColor);
    });
    it('should have correct background color for unread notification', function () {
      wrapper.setProps({ notification: assign(props.notification, { read: true }) });
      expectBasicStructure(wrapper);
      expect(wrapper.find('Card').prop('style').backgroundColor).equal(undefined);
    });
  });
  describe('for different notification types', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should render action buttons if type is INVITE_TO_PROJECT', function () {
      wrapper.setProps({ notification: assign(props.notification, {
        type: 'INVITE_TO_PROJECT',
      }) });
      expectBasicStructure(wrapper);
      expect(wrapper).to.have.exactly(2).descendants('FlatButton');
    });
    it('should not render action buttons if type is not INVITE_TO_PROJECT', function () {
      wrapper.setProps({ notification: assign(props.notification, {
        type: 'JOINED_PROJECT',
      }) });
      expectBasicStructure(wrapper);
      expect(wrapper).to.not.have.descendants('FlatButton');
    });
  });
  describe('for project accept/decline  action interaction', function () {
    const wrapper = mountWrapperWithProps(props);
    const onAcceptProjectMock = sinon.spy();
    const onDeclineProjectMock = sinon.spy();
    wrapper.setProps({
      actions: {
        onAcceptProject: onAcceptProjectMock,
        onDeclineProject: onDeclineProjectMock,
      },
      notification: assign(props.notification, {
        type: 'INVITE_TO_PROJECT',
      }),
    });
    beforeEach('reset dispatchMock', function () {
      onAcceptProjectMock.reset();
      onDeclineProjectMock.reset();
    });
    it('should trigger onAcceptProjectMock when acceptButton is clicked', function () {
      expectBasicStructure(wrapper);
      const acceptButtonWrapper = wrapper.find('FlatButton').last();
      acceptButtonWrapper.simulate('touchTap');
      expect(onAcceptProjectMock.calledOnce).to.equal(true);
    });
    it('should trigger onDeclineProjectMock when acceptButton is clicked', function () {
      expectBasicStructure(wrapper);
      const declineButtonWrapper = wrapper.find('FlatButton').first();
      declineButtonWrapper.simulate('touchTap');
      expect(onDeclineProjectMock.calledOnce).to.equal(true);
    });
  });
});
