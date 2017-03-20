import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import Notification from './../../../js/components/Notification/Notification.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<Notification {...props} />);


/* eslint-disable func-names, prefer-arrow-callback */
describe('Notification.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('div.main-content');
    expect(wrapper).to.have.exactly(1).descendants('div div h2');
  };
  const props = {
    notifications: [
      {
        id: 'N1g_BcvdG',
        text: 'Ge Hu has invited you to the project haha',
        time: '2017-02-11T05:51:11.000Z',
        read: true,
        link: '',
        type: 'INVITE_TO_PROJECT',
        meta: {
          user_id: 'Nk89qOUdM',
          project_id: 'VkH8B5P_f',
        },
      },
      {
        id: 'id3',
        text: 'someone sent you a notification',
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
    actions: sinon.spy(),
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

  describe('with different length of notification item', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should render correctly for 0 notification', function () {
      wrapper.setProps({ notifications: [] });
      expectBasicStructure(wrapper);
      expect(wrapper).to.not.have.descendants('Subheader');
      expect(wrapper).to.have.exactly(1).descendants('div.no-items');
      expect(wrapper.find('div.no-items h3').first()).to.have.text('No recent notification!');
    });
    it('should render correctly for 1 read notification', function () {
      wrapper.setProps({ notifications: [props.notifications[0]] });
      expectBasicStructure(wrapper);
      expect(wrapper).to.not.have.descendants('Subheader');
      expect(wrapper).to.not.have.descendants('div.no-items');
      expect(wrapper).to.have.exactly(1).descendants('NotificationList');
      expect(wrapper.find('NotificationList')).to.have.prop('notifications')
        .deep.equal([props.notifications[0]]);
    });
    it('should render correctly for 1 unread notification', function () {
      wrapper.setProps({ notifications: [props.notifications[1]] });
      expectBasicStructure(wrapper);
      expect(wrapper).to.have.exactly(1).descendants('Subheader');
      expect(wrapper).to.not.have.descendants('div.no-items');
      expect(wrapper).to.have.exactly(1).descendants('NotificationList');
      expect(wrapper.find('NotificationList')).to.have.prop('notifications')
        .deep.equal([props.notifications[1]]);
    });
    it('should render correctly for 2 unread notifications', function () {
      wrapper.setProps({ notifications: props.notifications });
      expectBasicStructure(wrapper);
      expect(wrapper).to.have.exactly(1).descendants('Subheader');
      expect(wrapper).to.not.have.descendants('div.no-items');
      expect(wrapper).to.have.exactly(1).descendants('NotificationList');
      expect(wrapper.find('NotificationList')).to.have.prop('notifications')
        .deep.equal(props.notifications);
    });
  });
});
