import assgin from 'object-assign';
import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/projects.js';
import * as types from '../../js/AppConstants.js';

const initialState = [
  {
    id: 'projectId1',
    content: 'cs4218',
    milestones: [
      '4JeJBs0dz',
      'V1BBAPyKz',
    ],
    tasks: [
      '41FnnjJtz',
    ],
    creator: 'EkD69ORwf',
    basic: [],
    pending: ['userX'],
    root_folder: null,
    directory_structure: [
      {
        id: 'rootId',
        name: 'root',
      },
      {
        id: 'parentId',
        name: 'parent',
      },
    ],
    files_loaded: false,
    github_repo_name: null,
    github_repo_owner: null,
    chatroom: null,
  },
  {
    id: '4yibW_1Yz',
    content: 'a',
    milestones: [
      '4JeJBs0dz',
      'V1BBAPyKz',
    ],
    tasks: [
      '41FnnjJtz',
    ],
    creator: 'Nk89qOUdM',
    basic: [
      'EkD69ORwf',
    ],
    pending: [],
    root_folder: null,
    directory_structure: [],
    files_loaded: false,
    github_repo_name: null,
    github_repo_owner: null,
    chatroom: null,
  },
];
describe('`projects ` reducer', () => {
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
  it('should handle `INIT_PROJECTS`', () => {
    const stateBefore = [];
    const action = {
      type: types.INIT_PROJECTS,
      projects: [
        {
          id: 'Vyb7JRXuf',
          content: 'b',
          milestones: [
            '4JeJBs0dz',
            'V1BBAPyKz',
            '4JqP7Kt_f',
          ],
          tasks: [
            '41FnnjJtz',
            'VJ-xTf3uM',
            'Vy_oBLpdM',
          ],
          creator: 'EkD69ORwf',
          basic: [
            'Nk89qOUdM',
          ],
          pending: [],
          root_folder: null,
          directory_structure: [],
          files_loaded: false,
          github_repo_name: null,
          github_repo_owner: null,
          chatroom: null,
        },
      ],
    };
    const expected = action.projects;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `CREATE_PROJECT`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.CREATE_PROJECT,
      project: {
        id: 'Vyb7JRXuf',
        content: 'b',
        milestones: [
          '4JeJBs0dz',
          'V1BBAPyKz',
          '4JqP7Kt_f',
        ],
        tasks: [
          '41FnnjJtz',
          'VJ-xTf3uM',
          'Vy_oBLpdM',
        ],
        creator: 'EkD69ORwf',
        basic: [
          'Nk89qOUdM',
        ],
        pending: [],
        root_folder: null,
        directory_structure: [],
        files_loaded: false,
        github_repo_name: null,
        github_repo_owner: null,
        chatroom: null,
      },
    };
    const expected = [action.project, ...initialState];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `DELETE_PROJECT`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.DELETE_PROJECT,
      id: 'projectId1',
    };
    const expected = [initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `REPLACE_PROJECT_ID`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.REPLACE_PROJECT_ID,
      original: 'projectId1',
      replacement: 'fjklsaAZ',
    };
    const edited = assgin({}, stateBefore[0], { id: action.replacement });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UPDATE_PROJECT`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UPDATE_PROJECT,
      id: 'projectId1',
      payload: {
        content: 'new content',
      },
    };
    const edited = assgin({}, stateBefore[0], action.payload);
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `JOIN_PROJECT`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.JOIN_PROJECT,
      id: 'projectId1',
      user_id: 'userX',
    };
    const edited = assgin({}, stateBefore[0], {
      pending: [],
      basic: [action.user_id],
    });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_DIRECTORY` with duplicate', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_DIRECTORY,
      id: 'projectId1',
      directory: {
        id: 'rootId',
        name: 'root',
      },
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_DIRECTORY` without duplicate', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_DIRECTORY,
      id: 'projectId1',
      directory: {
        id: 'dir1',
        name: 'file',
      },
    };
    const edited = assgin({}, initialState[0], {
      directory_structure: [
        {
          id: 'rootId',
          name: 'root',
        },
        {
          id: 'parentId',
          name: 'parent',
        },
        action.directory,
      ],
    });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `GO_TO_DIRECTORY` for invalid directory', () => {
    const stateBefore = initialState;
    const action = {
      type: types.GO_TO_DIRECTORY,
      projectId: 'projectId1',
      dirId: 'dumyId',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `GO_TO_DIRECTORY` for valid directory', () => {
    const stateBefore = initialState;
    const action = {
      type: types.GO_TO_DIRECTORY,
      projectId: 'projectId1',
      dirId: 'rootId',
    };
    const edited = assgin({}, initialState[0], {
      directory_structure: [
        {
          id: 'rootId',
          name: 'root',
        },
      ],
    });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });

  it('should handle `SET_DIRECTORY_AS_ROOT` for invalid project', () => {
    const stateBefore = initialState;
    const action = {
      type: types.SET_DIRECTORY_AS_ROOT,
      projectId: 'dummy',
      dirId: 'dumyId',
    };
    const expected = stateBefore;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `SET_DIRECTORY_AS_ROOT` for valid project', () => {
    const stateBefore = initialState;
    const action = {
      type: types.SET_DIRECTORY_AS_ROOT,
      projectId: 'projectId1',
      dirId: 'parentId',
    };
    const edited = assgin({}, initialState[0], {
      directory_structure: [
        {
          id: 'parentId',
          name: 'parent',
        },
      ],
      folder_error: '',
      root_folder: action.dirId,
    });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });

  it('should handle `SET_GITHUB_REPO`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.SET_GITHUB_REPO,
      projectId: 'projectId1',
      repoName: 'NUSCollab',
      repoOwner: 'Cristina',
    };
    const edited = assgin({}, initialState[0], {
      github_repo_name: action.repoName,
      github_repo_owner: action.repoOwner,
    });
    const expected = [edited, initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
