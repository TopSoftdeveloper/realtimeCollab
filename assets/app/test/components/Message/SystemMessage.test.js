import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import assign from 'object-assign';
import SystemMessage from './../../../js/components/Message/SystemMessage.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<SystemMessage {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('SystemMessage.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('Row');
    expect(wrapper).to.have.exactly(2).descendants('Col');
  };
  const props = {
    message: {
      id: '1',
      pinned: false,
      content: 'REOPEN_TASK',
      createdAt: '2017-04-05T09:23:22.000Z',
      data: '{"user":{"id":"41pEQvo2M","display_name":"JJ Zhang"},"task":{"id":"Nk4u8iTnG",' +
      '"content":"[Refactor] needs to change all \\"\\\\n\\" to System.lineSeparator()"}}',
      authorName: null,
    },
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('render with corner cases ', function () {
    const wrapper = shallowWrapperWithProps(props);

    it('should render empty with a invalid message type`', function () {
      wrapper.setProps({ message: assign(props.message, { content: 'invalid type' }) });
      expect(wrapper).to.be.blank();
    });
    it('should render empty with a empty JSON data field`', function () {
      wrapper.setProps({ message: assign(props.message, { data: null }) });
      expect(wrapper).to.be.blank();
    });
    it('should render empty with a invalid JSON data field`', function () {
      wrapper.setProps({ message: assign(props.message, { data: '{' }) });
      expect(wrapper).to.be.blank();
    });
  });
});
