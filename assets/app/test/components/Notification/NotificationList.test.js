import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import NotificationList from './../../../js/components/Notification/NotificationList.jsx';
import { toFuzzyTime } from './../../../js/utils/general';
import { mountWithContext } from '../../testUtils.js';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<NotificationList {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('NotificationList.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('div.notification-list');
    expect(wrapper).to.have.exactly(1).descendants('ul');
  };
  const props = {
    notifications: [
      {
        id: 'N1g_BcvdG',
        text: 'Ge Hu has invited you to the project haha',
        time: '2017-02-11T05:51:11.000Z',
        read: false,
        link: '',
        type: 'INVITE_TO_PROJECT',
        meta: {
          user_id: 'Nk89qOUdM',
          project_id: 'VkH8B5P_f',
        },
      },
      {
        id: '4Jdne0IOf',
        text: 'Ge Hu has joined the project b',
        time: '2017-02-10T15:51:51.000Z',
        read: false,
        link: '',
        type: 'JOINED_PROJECT',
        meta: {
          user_id: 'Nk89qOUdM',
          project_id: 'Vyb7JRXuf',
        },
      },
    ],
    dispatch: sinon.spy(),
    users: [
      {
        id: 'EkD69ORwf',
        email: 'zhangji951027@gmail.com',
        display_name: 'JJ Zhang',
        display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
        online: true,
        colour: '#03a9f4',
        me: true,
      },
      {
        id: 'Nk89qOUdM',
        display_name: 'Ge Hu',
        display_image: 'https://lh3.googleusercontent.com/-34GhtwX4QBU/AAAAAAAAAAI/AAAAAAAAAAs/agmR3sUJtg8/photo.jpg?sz=50',
        email: 'jizhang95@gmail.com',
        online: true,
        colour: '#f44336',
      },
    ],
    actionButtons: null,
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('render with empty Notifications', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ notifications: [] });
    expectBasicStructure(wrapper);
    it('should render zero Notification Item`', function () {
      expect(wrapper).to.not.have.descendants('NotificationItem');
    });
  });
  describe('render with single Notification of type `JOINED_PROJECT`', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ notifications: [props.notifications[1]] });
    expectBasicStructure(wrapper);
    it('should render single Notification Item`', function () {
      expect(wrapper).to.have.exactly(1).descendants('NotificationItem');
    });
    it('should pass correct props to Notification Item`', function () {
      expect(wrapper.find('NotificationItem').first()).to.have.props({
        text: props.notifications[1].text,
        read: props.notifications[1].read,
        time: toFuzzyTime(props.notifications[1].time),
      });
      expect(wrapper.find('NotificationItem').first()).to.have.prop('user')
        .deep.equal(props.users[1]);
    });
  });

  describe('render with single Notification of type `INVITE_TO_PROJECT`', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ notifications: [props.notifications[0]] });
    expectBasicStructure(wrapper);
    it('should render single Notification Item`', function () {
      expect(wrapper).to.have.exactly(1).descendants('NotificationItem');
    });
    it('should pass correct props to Notification Item`', function () {
      expect(wrapper.find('NotificationItem').first()).to.have.props({
        text: props.notifications[0].text,
        read: props.notifications[0].read,
        time: toFuzzyTime(props.notifications[0].time),
      });
      expect(wrapper.find('NotificationItem').first()).to.have.prop('user')
        .deep.equal(props.users[1]);
    });
    it('should render two action buttons as notificationItem props', function () {
      const actionButtonsWrapper = shallow(wrapper.find('NotificationItem').first()
        .prop('actionButtons'));
      expect(actionButtonsWrapper).to.have.exactly(1).descendants('div.notif-buttons');
      expect(actionButtonsWrapper).to.have.exactly(2).descendants('RaisedButton');
      expect(actionButtonsWrapper.find('RaisedButton').first()).to.have.props({
        label: 'Accept',
        primary: true,
      });
      expect(actionButtonsWrapper.find('RaisedButton').last()).to.have.props({
        label: 'Decline',
        secondary: true,
      });
    });
  });
  describe('render with mutliple Notifications but empty user`', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ users: [] });
    expectBasicStructure(wrapper);
    it('should render same number of Notification Item`', function () {
      expect(wrapper).to.have.exactly(props.notifications.length).descendants('NotificationItem');
    });
    it('should not pass prop `user` to NotificationItem', function () {
      wrapper.find('NotificationItem').forEach(function (node) {
        expect(node).to.not.have.prop('user');
      });
    });
    it('should render two action buttons as notificationItem props', function () {
      const actionButtonsWrapper = shallow(wrapper.find('NotificationItem').first()
        .prop('actionButtons'));
      expect(actionButtonsWrapper).to.have.exactly(1).descendants('div.notif-buttons');
      expect(actionButtonsWrapper).to.have.exactly(2).descendants('RaisedButton');
      expect(actionButtonsWrapper.find('RaisedButton').first()).to.have.props({
        label: 'Accept',
        primary: true,
      });
      expect(actionButtonsWrapper.find('RaisedButton').last()).to.have.props({
        label: 'Decline',
        secondary: true,
      });
    });
  });
  describe('check the interaction when button is clicked`', function () {
    const wrapper = mountWithContext(<NotificationList {...props} />);
    const dispatchMock = sinon.spy();
    wrapper.setProps({ dispatch: dispatchMock });
    expectBasicStructure(wrapper);
    beforeEach('reset dispatchMock', function () {
      dispatchMock.reset();
    });
    it('should render same number of Notification Item`', function () {
      expect(wrapper).to.have.exactly(props.notifications.length).descendants('NotificationItem');
    });
    it('should pass null prop `user` to NotificationItem', function () {
      wrapper.find('NotificationItem').forEach(function (node) {
        expect(node).to.have.prop('user').deep.equal(props.users[1]);
      });
    });
    it('should trigger the dispatchMock when Accept button is clicked', function () {
      const acceptButtonWrapper = wrapper.find('EnhancedButton').first();
      acceptButtonWrapper.simulate('touchTap');
      expect(dispatchMock.calledOnce).to.equal(true);
    });
    it('should trigger the dispatchMock when Accept button is clicked', function () {
      const declineButtonWrapper = wrapper.find('EnhancedButton').last();
      declineButtonWrapper.simulate('touchTap');
      expect(dispatchMock.calledOnce).to.equal(true);
    });
  });
});
