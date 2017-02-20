import { expectReducerBehavior } from '../testUtils.js';
import reducer from '../../js/reducers/files.js';
import * as types from '../../js/AppConstants.js';

const initialState = [
  {
    id: '0B6AfgueBZ9TMZndEV3JHbUFtSkE',
    name: 'New Folder',
    mimeType: 'application/vnd.google-apps.folder',
    parents: [
      '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
    ],
  },
  {
    id: '0B6AfgueBZ9TMaklrTHdPbUVGYmM',
    name: 'b.txt',
    mimeType: 'text/plain',
    parents: [
      'B6AfB6AfB6AfB6AfB6AfB6Af',
    ],
  },
];
describe('`files` reducer', () => {
  it('should return the initial state', () => {
    const expected = [];
    expectReducerBehavior(reducer, undefined, {}, expected);
  });
  it('should return current state for Unknown action', () => {
    const stateBefore = initialState;
    const action = {
      type: 'dummy',
    };
    expectReducerBehavior(reducer, stateBefore, action, stateBefore);
  });
  it('should handle `INIT_FILES`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.INIT_FILES,
      files: [
        {
          id: 'Afgue0B6BZ9TMZndEV3JHbUFtSkE',
          name: 'file',
          mimeType: 'application/vnd.google-apps.file',
          parents: [
            'safjlk31r1343lkjr',
          ],
        },
      ],
    };
    const expected = action.files;
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `UPDATE_FILE`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.UPDATE_FILE,
      id: initialState[0].id,
      payload: {
        name: 'renamed',
      },
    };
    const expected = [
      {
        id: '0B6AfgueBZ9TMZndEV3JHbUFtSkE',
        name: 'renamed',
        mimeType: 'application/vnd.google-apps.folder',
        parents: [
          '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
        ],
      },
      initialState[1],
    ];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `ADD_FILES` with duplicate', () => {
    const stateBefore = initialState;
    const action = {
      type: types.ADD_FILES,
      files: [
        {
          id: 'asdfkljfadasklfj1',
          name: 'non-duplicate',
          mimeType: 'application/vnd.google-apps.file',
          parents: [
            '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
          ],
        },
        {
          id: '0B6AfgueBZ9TMZndEV3JHbUFtSkE',
          name: 'duplicate',
          mimeType: 'application/vnd.google-apps.folder',
          parents: [
            '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
          ],
        },
      ],
    };
    const expected = [...initialState, ...[action.files[0]]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `INSERT_FILE`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.INSERT_FILE,
      file: {
        id: 'asdfkljfadasklfj1',
        name: 'non-duplicate',
        mimeType: 'application/vnd.google-apps.file',
        parents: [
          '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
        ],
      },
    };
    const expected = [...[action.file], ...initialState];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
  it('should handle `DELETE_FILE`', () => {
    const stateBefore = initialState;
    const action = {
      type: types.DELETE_FILE,
      id: initialState[0].id,
    };
    const expected = [initialState[1]];
    expectReducerBehavior(reducer, stateBefore, action, expected);
  });
});
