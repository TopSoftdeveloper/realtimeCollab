import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import EventList from './../../../js/components/Newsfeed/EventList.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<EventList {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('EventList.jsx', function () {
  const props = {
    events: [
      {
        id: 'VkFBgtADz',
        data: '{"user_id":"EkD69ORwf","fileName":"BBQ.txt"}',
        template: 'DRIVE_UPLOAD',
        source: 'GOOGLE_DRIVE',
        created_at: '2017-02-04T08:30:32.000Z',
        updated_at: '2017-02-04T08:30:32.000Z',
        project_id: 'Vy0p9_AvG',
      },
    ],
    users: [
      {
        id: 'EkD69ORwf',
        email: 'zhangji951027@gmail.com',
        display_name: 'JJ Zhang',
        display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
        online: true,
        colour: '#9e9e9e',
        me: true,
      },
    ],
  };

  describe('static rendering', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('render without explosion', function () {
      expect(wrapper).be.present();
    });
  });

  describe('static rendering with empty events and users', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ events: [], users: [] });
    it('should not render any EventItem', function () {
      expect(wrapper).to.not.have.descendants('EventItem');
    });
  });

  describe('static rendering with single event and valid user', function () {
    const wrapper = shallowWrapperWithProps(props);
    // Using default prop
    it('should render single EventItem', function () {
      expect(wrapper).to.have.exactly(1).descendants('EventItem');
    });
  });
  describe('static rendering with single event and empty user', function () {
    const events = [{
      id: 'VkFBgtADz',
      data: '{"user_id":"EkD69ORwf","fileName":"BBQ.txt"}',
      template: 'DRIVE_UPLOAD',
      source: 'GOOGLE_DRIVE',
      created_at: '2017-02-04T08:30:32.000Z',
      updated_at: '2017-02-04T08:30:32.000Z',
      project_id: 'Vy0p9_AvG',
    }];
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ events, users: [] });
    it('should not render any EventItem', function () {
      expect(wrapper).to.not.have.descendants('EventItem');
    });
  });
  describe('static rendering with single event and invalid user', function () {
    const events = [{
      id: 'VkFBgtADz',
      data: '{"user_id":"EkD69ORwf","fileName":"BBQ.txt"}',
      template: 'DRIVE_UPLOAD',
      source: 'GOOGLE_DRIVE',
      created_at: '2017-02-04T08:30:32.000Z',
      updated_at: '2017-02-04T08:30:32.000Z',
      project_id: 'Vy0p9_AvG',
    }];
    const users = [{
      id: 'invalidId',
      email: 'zhangji951027@gmail.com',
      display_name: 'JJ Zhang',
      display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
      online: true,
      colour: '#9e9e9e',
      me: true,
    }];
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ events, users });
    it('should not render any EventItem', function () {
      expect(wrapper).to.not.have.descendants('EventItem');
    });
  });
  describe('static rendering with mutiple events and multiple users', function () {
    const events = [
      {
        id: 'event1',
        data: '{"user_id":"user1","fileName":"BBQ.txt"}',
        template: 'DRIVE_UPLOAD',
        source: 'GOOGLE_DRIVE',
        created_at: '2017-02-04T08:30:32.000Z',
        updated_at: '2017-02-04T08:30:32.000Z',
        project_id: 'project1',
      },
      {
        id: 'event2',
        data: '{"user_id":"user2","fileName":"design.png"}',
        template: 'DRIVE_UPLOAD',
        source: 'GOOGLE_DRIVE',
        created_at: '2017-02-04T08:30:32.000Z',
        updated_at: '2017-02-04T08:30:32.000Z',
        project_id: 'project2',
      },
      {
        id: 'event3',
        data: '{"user_id":"nonexistentuser","fileName":"87.txt"}',
        template: 'DRIVE_UPLOAD',
        source: 'GOOGLE_DRIVE',
        created_at: '2012-03-04T08:30:32.000Z',
        updated_at: '2015-04-04T08:30:32.000Z',
        project_id: 'project2',
      },
    ];
    const users = [
      {
        id: 'user1',
        email: 'zhangji951027@gmail.com',
        display_name: 'JJ Zhang',
        display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
        online: true,
        colour: '#9e9e9e',
        me: true,
      },
      {
        id: 'user2',
        email: 'Benjamin231@gmail.com',
        display_name: 'Benjamin',
        display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
        online: true,
        colour: '#9e9e9e',
        me: false,
      },
    ];
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ events, users });
    it('should render two EventItem', function () {
      expect(wrapper).to.have.exactly(2).descendants('EventItem');
    });
  });
});
