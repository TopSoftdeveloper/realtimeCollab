import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import assign from 'object-assign';

import SearchResults from './../../../js/components/Search/SearchResults.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<SearchResults {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('SearchResults.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('Row');
    expect(wrapper).to.have.exactly(2).descendants('Col');
  };
  const props = {
    app: {
      is_linked_to_drive: true,
      is_top_level_folder_loaded: false,
      github: {
        loading: false,
      },
      files: {
        loading: false,
      },
      queriesInProgress: 0,
      loading: false,
      queryString: 'love',
      searchFilter: 'all',
      showSidebar: true,
      current_project: '4k_8lUc3M',
      github_token: '',
    },
    dispatch: sinon.spy(),
    search: [],
  };
  it('rendering without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
  describe('render with queriesInProgress', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should render Paper if not queriesInProgress and unempty result', function () {
      wrapper.setProps(assign(props, { Search: [
        {},
      ] }));
      expect(wrapper).to.have.exactly(1).descendants('Paper');
    });
    it('should not render Paper if queriesInProgress', function () {
      wrapper.setProps(assign(props, { app: {
        is_linked_to_drive: true,
        is_top_level_folder_loaded: false,
        queriesInProgress: 1,
        loading: false,
        queryString: 'love',
        searchFilter: 'all',
      } }));
      expect(wrapper).to.not.have.descendants('Paper');
    });
  });
  describe('rendering with empty result', function () {
    const wrapper = shallowWrapperWithProps(props);
    it('should not render any SelectField', function () {
      expect(wrapper).to.not.have.descendants('SelectField');
    });
    it('should not render any ListItem', function () {
      expect(wrapper).to.not.have.descendants('ListItem');
    });
  });
  describe('rendering with only drive result', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps(assign(props, { search: [
      {
        id: '1a-mpJutr6NgxuHRij_4E8cFmLl4iMjoFSuUzF4UIpaw',
        primaryText: 'Spread the Love 2016 Schedule',
        secondaryText: 'janzur',
        link: 'https://docs.google.com/spreadsheets/d/1a-mpJutr6NgxuHRij_4E8cFmLl4iMjoFSuUzF4UIpaw/edit?usp=drivesdk',
        thumbnail: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
        modifiedTime: '2016-03-07T11:15:17.499Z',
        type: 'drive',
      },
    ] }));
    expectBasicStructure(wrapper);
    it('should not render any SelectField', function () {
      expect(wrapper).to.not.have.descendants('SelectField');
    });
    it('should render 1 ListItem', function () {
      expect(wrapper).to.have.exactly(1).descendants('ListItem');
    });
  });
  describe('render with drive and task result', function () {
    const wrapper = shallowWrapperWithProps(props);
    wrapper.setProps(assign(props, { search: [
      {
        id: '1a-mpJutr6NgxuHRij_4E8cFmLl4iMjoFSuUzF4UIpaw',
        primaryText: 'Spread the Love 2016 Schedule',
        secondaryText: 'janzur',
        link: 'https://docs.google.com/spreadsheets/d/1a-mpJutr6NgxuHRij_4E8cFmLl4iMjoFSuUzF4UIpaw/edit?usp=drivesdk',
        thumbnail: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
        modifiedTime: '2016-03-07T11:15:17.499Z',
        type: 'drive',
      },
      {
        id: 'Ey9949h6f',
        primaryText: 'QA Report',
        secondaryText: 'JJ Zhang',
        thumbnail: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
        project_id: '4k_8lUc3M',
        project_content: 'CS4218',
        completed_on: null,
        type: 'task',
      },
    ] }));
    expectBasicStructure(wrapper);
    it('should render single SelectField', function () {
      expect(wrapper).to.have.exactly(1).descendants('SelectField');
    });
    it('should render 2 ListItem', function () {
      expect(wrapper).to.have.exactly(2).descendants('ListItem');
    });
  });
});
