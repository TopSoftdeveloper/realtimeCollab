import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dashboard from './../../../js/components/Dashboard/Dashboard.jsx';
import * as general from '../../../js/utils/general.js';

chai.use(chaiEnzyme());

const muiTheme = getMuiTheme();
const shallowWrapperWithProps = (props) => shallow(<Dashboard {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});
sinon.stub(general, 'getLocalUserId', () => 'id1');
/* eslint-disable func-names, prefer-arrow-callback */
describe('Dashboard.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('.main-content');
  };
  const props = {
    milestones: [],
    tasks: [],
    projects: [],
    actions: {
      onMarkTaskAsDone: sinon.spy(),
    },
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('render with correct props', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should not render any DashboardItem for empty props`', function () {
      expectBasicStructure(wrapper);
      expect(wrapper).to.not.have.descendants('Table');
      expect(wrapper).to.not.have.descendants('DashboardItem');
      expect(wrapper).to.have.exactly(1).descendants('.no-items');
    });
    it('should render not render taskRow if no tasks is assigned to current user ' +
    'and all tasks are assgined`', function () {
      wrapper.setProps({
        milestones: [
          {
            id: 'm1',
            project_id: 'p1',
            content: 'milestone 1',
          },
          {
            id: 'm2',
            project_id: 'p2',
            content: 'milestone 2',
          },
        ],
        projects: [
          {
            id: 'p1',
            content: 'CS4218',
          },
          {
            id: 'p2',
            content: 'APPDEV',
          },
        ],
        tasks: [
          {
            id: '4k3GtLOAf',
            content: 'a super long task',
            assignee_id: 'id2',
            milestone_id: 'm2',
            project_id: 'p2',
          },
          {
            id: '4y8LUsp2G',
            content: '[Application Implementation] pwd, cd',
            assignee_id: 'id2',
            milestone_id: 'm2',
            project_id: 'p2',
          },
        ],
      });
      expectBasicStructure(wrapper);
      expect(wrapper).to.not.have.descendants('Table');
      expect(wrapper).to.not.have.descendants('DashboardItem');
      expect(wrapper).to.have.exactly(1).descendants('.no-items');
    });
    it('should render two DashboardItem if one task is assigned to current user ' +
    'and one task is unassigned`', function () {
      wrapper.setProps({
        milestones: [
          {
            id: 'm1',
            project_id: 'p1',
            content: 'milestone 1',
          },
          {
            id: 'm2',
            project_id: 'p2',
            content: 'milestone 2',
          },
        ],
        projects: [
          {
            id: 'p1',
            content: 'CS4218',
          },
          {
            id: 'p2',
            content: 'APPDEV',
          },
        ],
        tasks: [
          {
            id: '4JoPLsp3f',
            content: 'Implement parsePipeAndSequence helper function',
            assignee_id: 'id1',
            milestone_id: 'm1',
            project_id: 'p1',
          },
          {
            id: '4k3GtLOAf',
            content: 'a super long task',
            assignee_id: 'id2',
            milestone_id: 'm2',
            project_id: 'p2',
          },
          {
            id: '4y8LUsp2G',
            content: '[Application Implementation] pwd, cd',
            assignee_id: 'id2',
            milestone_id: 'm2',
            project_id: 'p2',
          },
          {
            id: 'Ek7RP9haM',
            content: 'search bug for another team',
            assignee_id: '',
            milestone_id: 'm1',
            project_id: 'p1',
          },
        ],
      });
      expect(wrapper).to.have.exactly(1).descendants('Table');
      expect(wrapper).to.have.exactly(2).descendants('DashboardItem');
      expect(wrapper).to.not.have.descendants('.no-items');
    });
  });
});
