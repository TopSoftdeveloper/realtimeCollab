import React from 'react';
import chai, { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import assign from 'object-assign';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Message from './../../../js/components/Message/Message.jsx';
import { Color } from './../../../js/myTheme.js';
import { mountWithContext } from '../../testUtils.js';

chai.use(chaiEnzyme());

const muiTheme = getMuiTheme();
const shallowWrapperWithProps = (props) => shallow(<Message {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});
const mountWrapperWithProps = (props) => mount(<Message {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});

/* eslint-disable func-names, prefer-arrow-callback */
describe('Message.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(2).descendants('Paper');
    expect(wrapper).to.have.exactly(1).descendants('Subheader');
    expect(wrapper).to.have.descendants('MessageList');
  };
  const props = {
    milestones: [
      {
        id: '4kmF4FjnG',
        content: 'Milestone 2',
        deadline: '2017-04-21T16:00:00.000Z',
        project_id: '4k_8lUc3M',
        tasks: [
          'Ey5FIi6nf',
          'Nk4u8iTnG',
          'NyRioip3M',
        ],
      },
      {
        id: 'NJ8r8Kj2z',
        content: 'Milestone  1',
        deadline: '2017-04-13T16:00:00.000Z',
        created_at: '2017-04-03T18:40:37.000Z',
        updated_at: '2017-04-03T18:41:18.000Z',
        project_id: '4k_8lUc3M',
        tasks: [
          '4JoPLsp3f',
          '4y8LUsp2G',
          'VJbvLoThf',
          'VJidIsTnG',
          'VyCrUsT2M',
        ],
      },
    ],
    messages: [
      {
        id: '41-k3ja3M',
        content: 'REOPEN_TASK',
        author_id: null,
        pinned: false,
        content_updated_at: null,
        content_updated_by: null,
        data: '{"user":{"id":"41pEQvo2M","display_name":"JJ Zhang"},"task":{"id":"Nk4u8iTnG","content":"[Refactor] needs to change all \\"\\\\n\\" to System.lineSeparator()"}}',
        created_at: '2017-04-05T09:45:36.000Z',
        updated_at: '2017-04-05T09:45:36.000Z',
        milestone_id: '4kmF4FjnG',
        project_id: '4k_8lUc3M',
      },
      {
        id: '4yPeDoThM',
        content: '![Image](https://cloud.githubusercontent.com/assets/7593504/22514844/99ad7fbe-e8db-11e6-80ba-6285c8072149.png)\n no more single quote in `expected`',
        author_id: '41pEQvo2M',
        pinned: true,
        content_updated_at: '2017-04-05T09:25:31.000Z',
        content_updated_by: '41pEQvo2M',
        data: null,
        created_at: '2017-04-05T09:24:38.000Z',
        updated_at: '2017-04-05T09:25:54.000Z',
        milestone_id: '4kmF4FjnG',
        project_id: '4k_8lUc3M',
      },
      {
        id: '6C9dKeThM',
        content: 'hellow world',
        author_id: '4k3Ymvi2M',
        pinned: false,
        content_updated_at: '2017-04-05T09:25:31.000Z',
        content_updated_by: '4k3Ymvi2M',
        data: null,
        created_at: '2017-04-05T09:24:38.000Z',
        updated_at: '2017-04-05T09:25:54.000Z',
        milestone_id: '4kmF4FjnG',
        project_id: '4k_8lUc3M',
      },
    ],
    users: [
      {
        id: '4k3Ymvi2M',
        email: 'collab27@gmail.com',
        display_name: 'admin Collab',
        display_image: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
        online: true,
        colour: 'rgba(0, 0, 0, 0.87)',
        me: true,
      },
      {
        id: '41pEQvo2M',
        google_id: '114365973858389268003',
        email: 'zhangji951027@gmail.com',
        github_login: null,
        display_name: 'JJ Zhang',
        display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
        google_refresh_token: '1/Nf05UPxdZqGQiVndMpsC8lnM5NqPZ9sspXXqJBFBBsQ',
        github_refresh_token: null,
        created_at: '2017-04-02T20:21:30.000Z',
        updated_at: '2017-04-03T17:30:40.000Z',
        role: 'creator',
        online: false,
        colour: '#e91e63',
      },
    ],
    currentProject: {
      id: '4k_8lUc3M',
      content: 'CS4218',
      milestones: [
        '4kmF4FjnG',
        'NJ8r8Kj2z',
      ],
      creator: '41pEQvo2M',
      basic: [
        '4k3Ymvi2M',
        'NJ_kpBqhG',
        '41pEQvo2M',
      ],
      pending: [],
      root_folder: '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
      directory_structure: [
        {
          id: '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
          name: 'FILE_TEST_FOLDER',
        },
      ],
      files_loaded: true,
    },
    actions: {
      onPostNewMessage: sinon.spy(),
      onPinMessage: sinon.spy(),
      onUnpinMessage: sinon.spy(),
      onEditMessageContent: sinon.spy(),
      onDeleteMessage: sinon.spy(),
    },
    // props passed by parents
    showMilestoneSelector: false,
    milestoneId: '4kmF4FjnG',
    onDismiss: sinon.spy(),
    title: 'milestone2',
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('render with differnet props', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should render a title of ClippedText if prop `showMilestoneSelector` is false',
    function () {
      expect(wrapper.find('ClippedText')).to.have.prop('text', props.title);
    });
    it('should render a milestone selector if prop `showMilestoneSelector` is true', function () {
      wrapper.setProps({ showMilestoneSelector: true });
      expect(wrapper).to.have.exactly(1).descendants('Subheader Row Col SelectField');
    });
    it('should render a milestone selector if prop `onDismiss` is non-empty', function () {
      wrapper.setProps({ onDismiss: sinon.spy() });
      expect(wrapper).to.have.exactly(1).descendants('Subheader Row Col IconButton');
    });
    it('should not render a milestone selector if prop `onDismiss` is empty', function () {
      wrapper.setProps({ onDismiss: null });
      expect(wrapper).to.not.have.descendants('Subheader Row Col IconButton');
    });
    it('should render a additional pinned message list if some messages are pinned', function () {
      expect(wrapper).to.have.exactly(2).descendants('MessageList');
    });
  });
  describe('render with differnet states', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should hide all user messages if state `showSystemActivity` is false ', function () {
      wrapper.setState({ showSystemActivity: false });
      expect(wrapper).to.not.have.descendants('SystemMssage');
    });
    it('should hide all user messages if state `showUserMessage` is false ', function () {
      wrapper.setState({ showUserMessage: false });
      expect(wrapper).to.not.have.descendants('UserMeassage');
    });
    it('should render a MessageModal with correct contentValue if state `mode` is editMode',
    function () {
      wrapper.setState({ mode: {
        type: 'editMode',
        messageContent: 'content',
        onSumbitCallback: sinon.spy(),
      } });
      expect(wrapper).to.have.exactly(1).descendants('MessageModal');
      expect(wrapper.find('MessageModal')).to.have.prop('contentValue', 'content');
    });
    it('should render a MessageModal with empty contentValue if state `mode` is postMode',
    function () {
      wrapper.setState({ mode: {
        type: 'postMode',
      } });
      expect(wrapper).to.have.exactly(1).descendants('MessageModal');
      expect(wrapper.find('MessageModal')).to.not.have.prop('contentValue');
    });
  });
  describe('for various interactions', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should set initalState correctly', function () {
      expect(wrapper).to.have.state('mode').deep.equal({ type: 'initialMode' });
      expect(wrapper).to.have.state('showUserMessage', true);
      expect(wrapper).to.have.state('showSystemActivity', true);
    });
    it('should set state `mode` to postMode when focus on bottomPanel ', function () {
      wrapper.find('FormControl').simulate('focus');
      expect(wrapper).to.have.state('mode').deep.equal({ type: 'postMode' });
    });
    it('should toggle state `showUserMessage` when click on given info button ', function () {
      wrapper.find('Subheader Row Col span FlatButton').at(0).simulate('touchTap');
      expect(wrapper).to.have.state('showUserMessage', false);
      wrapper.find('Subheader Row Col span FlatButton').at(0).simulate('touchTap');
      expect(wrapper).to.have.state('showUserMessage', true);
    });
    it('should toggle state `showSystemActivity` when click on given info button ', function () {
      wrapper.find('Subheader Row Col span FlatButton').at(1).simulate('touchTap');
      expect(wrapper).to.have.state('showSystemActivity', false);
      wrapper.find('Subheader Row Col span FlatButton').at(1).simulate('touchTap');
      expect(wrapper).to.have.state('showSystemActivity', true);
    });
  });
});
