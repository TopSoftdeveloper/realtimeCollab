import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import assign from 'object-assign';
import EventItem from './../../../js/components/Newsfeed/EventItem.jsx';
import { toFuzzyTime } from './../../../js/utils/general';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<EventItem {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('EventItem.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('Card');
    expect(wrapper).to.have.exactly(1).descendants('CardHeader');
    expect(wrapper).to.have.exactly(1).descendants('Divider');
  };
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
    expectBasicStructure(wrapper);
  });
  describe('for static rendering', function () {
    it('should pass correct props of title and subtitle`', function () {
      expect(wrapper.find('CardHeader')).to.have.props({
        title: props.event.message,
        subtitle: toFuzzyTime(props.event.created_at),
      });
    });
    it('should render null if avatarUrl does not exist', function () {
      expect(wrapper.find('CardHeader').first().prop('avatar').props.src)
        .to.equal(props.event.avatarUrl);
    });
    it('should render null if avatarUrl does not exist', function () {
      wrapper.setProps({ event: assign(props.event, { avatarUrl: null }) });
      expect(wrapper.find('Card').prop('avatar')).equal(undefined);
    });
  });
});
