import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import NotificationItem from './../../../js/components/Notification/NotificationItem.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<NotificationItem {...props} />);


/* eslint-disable func-names, prefer-arrow-callback */
describe('NotificationItem.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('li');
    expect(wrapper.find('li')).to.have.className('notif-item');
    expect(wrapper).to.have.exactly(2).descendants('span');
    expect(wrapper.find('span').first()).to.have.className('notif-text');
    expect(wrapper.find('span').at(1)).to.have.className('notif-fuzzy-time');
    expect(wrapper).to.have.exactly(1).descendants('.notif-photo');
  };
  const props = {
    text: 'You have a new message',
    read: false,
    time: 'just now',
    user: {
      id: 'EkD69ORwf',
      email: 'zhangji951027@gmail.com',
      display_name: 'JJ Zhang',
      display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
      online: true,
      colour: '#03a9f4',
      me: true,
    },
    actionButtons: null,
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('static rendering with user and actionButtons to be null', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ user: null, actionButtons: null });
    expectBasicStructure(wrapper);
    it('should pass props of text and time correctly`', function () {
      expect(wrapper.find('.notif-text')).to.have.text(props.text);
      expect(wrapper.find('.notif-fuzzy-time')).to.have.text(props.time);
    });
    it('should not render <UserAvatar>', function () {
      expect(wrapper).to.not.have.descendants('UserAvatar');
    });
  });
  describe('static rendering with user', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should render <UserAvatar>', function () {
      expectBasicStructure(wrapper);
      expect(wrapper).to.have.exactly(1).descendants('UserAvatar');
    });
    it('should pass correct props to <UserAvatar>', function () {
      expect(wrapper.find('UserAvatar').first()).to.have.props(['imgSrc', 'displayName'])
      .deep.equal([props.user.display_image, props.user.display_name]);
    });
  });
  describe('should assgin <li> different className for prop `read`', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should assign <li> with className `notif-unread`', function () {
      wrapper.setProps({ read: false });
      expectBasicStructure(wrapper);
      expect(wrapper.find('li')).to.have.className('notif-unread');
    });
    it('should assign <li> with className `notif-read`', function () {
      wrapper.setProps({ read: true });
      expectBasicStructure(wrapper);
      expect(wrapper.find('li')).to.have.className('notif-read');
    });
  });
  describe('should render correctly what ever inside prop `actionButtons`', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should assign <li> with className `notif-read`', function () {
      wrapper.setProps({ actionButtons: <div className="button">buttons here</div> });
      expectBasicStructure(wrapper);
      expect(wrapper.find('.button').first()).have.html(
        '<div class="button">buttons here</div>');
    });
  });
});
