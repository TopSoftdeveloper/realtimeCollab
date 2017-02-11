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
    expect(wrapper).to.have.exactly(1).descendants('div.notif-container');
    expect(wrapper.find('h4')).to.have.text('All Notifications');
    expect(wrapper).to.have.exactly(1).descendants('NotificationList');
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
});
