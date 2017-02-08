import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import EventItem from './../../../js/components/Newsfeed/EventItem.jsx';
import { toFuzzyTime } from './../../../js/utils/general';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<EventItem {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('EventItem.jsx', function () {
  const props = {
    event: {
      avatarUrl: 'dummyUrl',
      displayName: 'westboy',
      message: 'something happened and notif you now',
      created_at: '2017-02-04 08:11:01',
    },
  };
  const wrapper = shallowWrapperWithProps(props);
  it('render without explosion', function () {
    expect(wrapper).be.present();
  });
  describe('static rendering', function () {
    it('should render single <li> with class name `event-item`', function () {
      expect(wrapper).to.have.exactly(1).descendants('li');
      expect(wrapper.find('li').first()).to.have.className('event-item');
    });
    it('should render single <UserAvatar> with correct props', function () {
      expect(wrapper).to.have.exactly(1).descendants('UserAvatar');
      expect(wrapper.find('UserAvatar').first()).to.have.props({
        imgSrc: props.event.avatarUrl,
        displayName: props.event.displayName,
      });
    });
    it('should render single element with class name `notif-text`' +
    ' and pass correct message', function () {
      expect(wrapper).to.have.exactly(1).descendants('.notif-text');
      expect(wrapper.find('.notif-text').text()).to.equal(props.event.message);
    });
    it('should render single element with class name `notif-fuzzy-time`' +
     'and render correct fuzzy-time', function () {
      expect(wrapper).to.have.exactly(1).descendants('.notif-fuzzy-time');
      expect(wrapper.find('.notif-fuzzy-time').text()).to.equal(
        toFuzzyTime(props.event.created_at)
      );
    });
  });
});
