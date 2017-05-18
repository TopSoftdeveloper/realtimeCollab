import React from 'react';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import SearchBar from './../../../js/components/Search/SearchBar.jsx';

chai.use(chaiEnzyme());
const shallowWrapperWithProps = (props) => shallow(<SearchBar {...props} />);

/* eslint-disable func-names, prefer-arrow-callback */
describe('SearchBar.jsx', function () {
  const expectBasicStructure = (wrapper) => {
    expect(wrapper).to.have.exactly(1).descendants('AutoComplete');
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
    actions: {},
    search: [
      {
        id: '1opLi8rGZbeiuWblBGSYPjOuoWlK5uWzFwl-n_gb2m4Y',
        primaryText: 'SPREAD THE LOVE Manpower Allocation.xlsx',
        secondaryText: 'Zhixi Liang',
        link: 'https://docs.google.com/spreadsheets/d/1opLi8rGZbeiuWblBGSYPjOuoWlK5uWzFwl-n_gb2m4Y/edit?usp=drivesdk',
        thumbnail: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
        modifiedTime: '2016-02-15T03:07:22.356Z',
        type: 'drive',
      },
      {
        id: '1a-mpJutr6NgxuHRij_4E8cFmLl4iMjoFSuUzF4UIpaw',
        primaryText: 'Spread the Love 2016 Schedule',
        secondaryText: 'janzur',
        link: 'https://docs.google.com/spreadsheets/d/1a-mpJutr6NgxuHRij_4E8cFmLl4iMjoFSuUzF4UIpaw/edit?usp=drivesdk',
        thumbnail: 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
        modifiedTime: '2016-03-07T11:15:17.499Z',
        type: 'drive',
      },
    ],
  };
  it('render without explosion', function () {
    const wrapper = shallowWrapperWithProps(props);
    expect(wrapper).be.present();
    expectBasicStructure(wrapper);
  });
});
