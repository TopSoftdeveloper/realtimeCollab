import React from 'react';
import chai, { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import DashboardItem from './../../../js/components/Dashboard/DashboardItem.jsx';

chai.use(chaiEnzyme());

const muiTheme = getMuiTheme();
const shallowWrapperWithProps = (props) => shallow(<DashboardItem {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});
const mountWrapperWithProps = (props) => mount(<DashboardItem {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});

/* eslint-disable func-names, prefer-arrow-callback */
describe('DashboardItem.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('TableRow');
    expect(wrapper).to.have.exactly(3).descendants('TableRowColumn');
  };
  const props = {
    task: {
      id: '4JoPLsp3f',
      content: 'Implement parsePipeAndSequence helper function',
      completed_on: '2017-04-25T15:10:45.000Z',
      github_id: null,
      github_number: null,
      assignee_id: '',
      created_at: '2017-04-05T09:22:18.000Z',
      updated_at: '2017-04-25T15:10:45.000Z',
      milestone_id: 'NJ8r8Kj2z',
      project_id: '4k_8lUc3M',
    },
    projectId: '4k_8lUc3M',
    projectName: 'CS4218',
    milestoneName: 'M2',
    onCheck: sinon.spy(),
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('render with correct props', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should render a unchecked checkbox in the first col`', function () {
      expect(wrapper.find('TableRowColumn').first()).to.have.exactly(1).descendants('Checkbox');
      expect(wrapper.find('Checkbox')).to.not.have.prop('checked');
    });
    it('should render task content in the second col`', function () {
      expect(wrapper.find('TableRowColumn').at(1).children()).to.have.text(props.task.content);
    });
    it('should render project and milestone name in the third col`', function () {
      expect(wrapper.find('TableRowColumn').at(2)).to.have.exactly(1).descendants('Chip');
      expect(wrapper.find('Chip').children()).to.include.text(props.projectName);
      expect(wrapper.find('Chip').children()).to.include.text(props.milestoneName);
    });
  });
  describe('intercation with correct callback', function () {
    const onCheckSpy = sinon.spy();
    const wrapper = mountWrapperWithProps(props);
    wrapper.setProps({ onCheck: onCheckSpy });
    it.skip('should call onCheck with correct projectId', function () {
      // cannot find correct wrapper due to limitation of simulate
      onCheckSpy.reset();
      const checkboxWrapper = wrapper.find('Checkbox').first();
      checkboxWrapper.simulate('touchTap');
      expect(onCheckSpy.calledOnce).to.equal(true);
      expect(onCheckSpy.calledWith(props.projectId)).to.equal(true);
      expect(onCheckSpy.calledWith(props.task.id)).to.equal(true);
    });
  });
});
