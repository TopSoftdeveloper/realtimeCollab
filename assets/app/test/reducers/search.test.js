import assgin from 'object-assign';
import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/search.js';
import * as types from '../../js/AppConstants.js';

const initialState =  [
  {
    id: '0B6AfgueBZ9TMTlh1UjJObWo5V1E',
    primaryText: 'BBQ.txt',
    secondaryText: 'JJ Zhang',
    link: 'https://drive.google.com/file/d/0B6AfgueBZ9TMTlh1UjJObWo5V1E/view?usp=drivesdk',
    thumbnail: 'https://ssl.gstatic.com/docs/doclist/images/icon_10_text_list.png',
    modifiedTime: '2017-02-04T08:30:32.100Z',
    type: 'drive',
  },
  {
    id: 'N1n3ZSCOf',
    primaryText: 'hey boy\na',
    secondaryText: 'Ge Hu',
    thumbnail: 'https://lh3.googleusercontent.com/-34GhtwX4QBU/AAAAAAAAAAI/AAAAAAAAAAs/agmR3sUJtg8/photo.jpg?sz=50',
    project_id: 'EkTq9OUdG',
    project_content: 'cs2103',
    completed_on: null,
    type: 'task',
  },
];
describe('`search ` reducer', () => {
  it('should return the initial state', () => {
    const expected = [];
    expectReducerBehavior(reducer, undefined, [], expected);
  });
  it('should return current state for Unknown action', () => {
    const stateBefore = initialState;
    const action = {
      type: 'dummy',
      value: 1321,
    };
    expectReducerBehavior(reducer, stateBefore, action, stateBefore);
  });
  it('should handle `INIT_RESULTS`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.INIT_RESULTS,
      results: [
        {
          id: 'N1n3ZSCOf',
          primaryText: 'hey boy\na',
          secondaryText: 'Ge Hu',
          thumbnail: 'https://lh3.googleusercontent.com/-34GhtwX4QBU/AAAAAAAAAAI/AAAAAAAAAAs/agmR3sUJtg8/photo.jpg?sz=50',
          project_id: 'EkTq9OUdG',
          project_content: 'cs2103',
          completed_on: null,
          type: 'task',
        },
      ],
    };
    const expected = action.results;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_RESULTS` with duplicate', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_RESULTS,
      results: initialState,
    };
    const expected = initialState;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_RESULTS` without duplicate', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_RESULTS,
      results: [
        {
          id: '0B6AfgueBZ9TMM1ZMUC1pZGY4RlU',
          primaryText: 'ZhangJi_Submission.zip',
          secondaryText: 'JJ Zhang',
          link: 'https://drive.google.com/file/d/0B6AfgueBZ9TMM1ZMUC1pZGY4RlU/view?usp=drivesdk',
          thumbnail: 'https://ssl.gstatic.com/docs/doclist/images/icon_9_archive_list.png',
          modifiedTime: '2017-01-25T15:58:00.475Z',
          type: 'drive',
        },
        {
          id: '0B6AfgueBZ9TMZG5wWG1zYldOalk',
          primaryText: 'rootFile.js',
          secondaryText: 'JJ Zhang',
          link: 'https://drive.google.com/file/d/0B6AfgueBZ9TMZG5wWG1zYldOalk/view?usp=drivesdk',
          thumbnail: 'https://ssl.gstatic.com/docs/doclist/images/generic_app_icon_16.png',
          modifiedTime: '2017-01-20T13:56:58.720Z',
          type: 'drive',
        },
      ],
    };
    const expected = [...action.results, ...initialState];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
