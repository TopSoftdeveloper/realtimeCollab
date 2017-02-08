import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import Newsfeed from './../../../js/components/Newsfeed/Newsfeed.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<Newsfeed {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('Newsfeed.jsx', function () {
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
    it('render single EventList', function () {
      expect(wrapper).to.have.exactly(1).descendants('EventList');
    });
    it('pass props correctly to eventList', function () {
      expect(wrapper.find('EventList').first()).to.have.props(['events', 'users']).deep.equal(
        [props.events, props.users]
      );
    });
  });
  describe('static rendering with empty events and users', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ events: [], users: [] });
    it('pass props correctly to eventList', function () {
      expect(wrapper.find('EventList').first()).to.have.props(['events', 'users']).deep.equal(
        [[], []]);
    });
  });
  describe('static rendering with events and users', function () {
    const wrapper = shallowWrapperWithProps(props);
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
    wrapper.setProps({ events, users });
    it('pass props correctly to eventList', function () {
      expect(wrapper.find('EventList').first()).to.have.props(['events', 'users']).deep.equal(
        [events, users]);
    });
  });
});
