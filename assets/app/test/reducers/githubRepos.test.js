import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/githubRepos.js';
import * as types from '../../js/AppConstants.js';

const initialState = [
  {
    id: 42383923,
    name: '-CViA-Curriculum-Vitae-Analyzer',
    full_name: 'a13576606825/-CViA-Curriculum-Vitae-Analyzer',
  },
  {
    id: 90815341,
    name: 'Collab-test',
    full_name: 'a13576606825/Collab-test',
  },
];
describe('`githubRepos` reducer', () => {
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
  it('should handle `INIT_GITHUB_REPOS`', () => {
    const stateBefore = {
      project_invitation: 'USER_NOT_FOUND',
    };
    const action = {
      type: types.INIT_GITHUB_REPOS,
      repos: [
        {
          id: 39082043,
          name: 'CS2103-Project',
          full_name: 'a13576606825/CS2103-Project',
        },
        {
          id: 8394217,
          name: 'Collab-UT',
          full_name: 'a13576606825/Collab-UT',
        },
      ],
    };
    const expected = action.repos;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
