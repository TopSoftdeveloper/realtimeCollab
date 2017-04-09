import React from 'react';
import chai, { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import assign from 'object-assign';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MessageList from './../../../js/components/Message/MessageList.jsx';

chai.use(chaiEnzyme());

const muiTheme = getMuiTheme();
const shallowWrapperWithProps = (props) => shallow(<MessageList {...props} />);
const mountWrapperWithProps = (props) => mount(<MessageList {...props} />, {
  context: { muiTheme },
  childContextTypes: { muiTheme: React.PropTypes.object },
});

/* eslint-disable func-names, prefer-arrow-callback */
describe('MessageList.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('div');
  };
  const props = {
    pinned: false,
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
        pinned: false,
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
    actions: {
      onPostNewMessage: sinon.spy(),
      onPinMessage: sinon.spy(),
      onUnpinMessage: sinon.spy(),
      onEditMessageContent: sinon.spy(),
      onDeleteMessage: sinon.spy(),
    },
    onEnterEditMode: sinon.spy(),
  };

  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('render with different props', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should render correct number of UserMessage', function () {
      expect(wrapper).to.have.exactly(2).descendants('UserMessage');
    });
    it('should render correct number of SystemMessage', function () {
      expect(wrapper).to.have.exactly(1).descendants('SystemMssage');
    });
  });
  describe('render with unfound users', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps({ users: [props.users[0]] });
    it('should render correct number of UserMessage', function () {
      expect(wrapper).to.have.exactly(1).descendants('UserMessage');
    });
    it('should render correct number of SystemMessage', function () {
      expect(wrapper).to.have.exactly(1).descendants('SystemMssage');
    });
  });
});
