import { expect } from 'chai';
import assign from 'object-assign';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import sinonStubPromise from 'sinon-stub-promise';

import * as actions from '../../js/actions/ReduxTaskActions.js';
import * as types from '../../js/AppConstants.js';
import * as general from '../../js/utils/general.js';
import * as apiUtil from '../../js/utils/apiUtil.js';

sinonStubPromise(sinon);

const expectDeepEqual = (obj1, obj2) => {
  expect(obj1).to.deep.equal(obj2);
};
/* eslint no-underscore-dangle: "off" */
/* eslint-disable func-names, prefer-arrow-callback */
describe('action - `_updateAppStatus`', function () {
  it('should create an action to update app status', function () {
    const app = {
      key1: 'value1',
      key2: ['value2', 'value3'],
    };
    const expectedAction = {
      type: types.UPDATE_APP_STATUS,
      app,
    };
    expectDeepEqual(actions._updateAppStatus(app), expectedAction);
  });
});

describe('action - `snackbarMessage`', function () {
  it('should create an action to trigger snackbar message', function () {
    const message = 'some notification';
    const kind = 'default';
    const expectedAction = {
      type: types.SNACKBAR_MESSAGE,
      message,
      kind,
    };
    expectDeepEqual(actions.snackbarMessage(message, kind), expectedAction);
  });
});

describe('action - `updateSnackbar`', function () {
  it('should create an action to update snackbar', function () {
    const snackbar = {
      isOpen: false,
      message: 'Task reopened',
      background: 'rgba(0, 0, 0, 0.870588)',
    };
    const expectedAction = {
      type: types.UPDATE_SNACKBAR,
      snackbar,
    };
    expectDeepEqual(actions.updateSnackbar(snackbar), expectedAction);
  });
});

describe('action - `replaceTaskId`', function () {
  it('should create an action to replace task id', function () {
    const original = 'taskid1231';
    const replacement = 'safjkl13lkvaklaksdj';
    const expectedAction = {
      type: types.REPLACE_TASK_ID,
      original,
      replacement,
    };
    expectDeepEqual(actions.replaceTaskId(original, replacement), expectedAction);
  });
});

describe('action - `replaceMilestoneId`', function () {
  it('should create an action to replace task id', function () {
    const original = 'taskid1231';
    const replacement = 'safjkl13lkvaklaksdj';
    const expectedAction = {
      type: types.REPLACE_MILESTONE_ID,
      original,
      replacement,
    };
    expectDeepEqual(actions.replaceMilestoneId(original, replacement), expectedAction);
  });
});

describe('action - `_addTask`', function () {
  it('should create an action to add a new task', function () {
    const task = {
      id: 'task86',
      content: 'cba',
      project_id: 'EkTq9OUdG',
      milestone_id: 'Eyz0rITuG',
      assignee_id: '',
    };
    const expectedAction = {
      type: types.ADD_TASK,
      task,
    };
    expectDeepEqual(actions._addTask(task), expectedAction);
  });
});

describe('action - `_editTask`', function () {
  it('should create an action to edit a task with id', function () {
    const id = 'sadkfjl213skafj134';
    const task = {
      content: 'come on',
      assignee_id: '',
    };
    const expectedAction = {
      type: types.EDIT_TASK,
      id,
      task,
    };
    expectDeepEqual(actions._editTask(id, task), expectedAction);
  });
});

describe('action - `_deleteTask`', function () {
  it('should create an action to delete a task by id', function () {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.DELETE_TASK,
      id,
    };
    expectDeepEqual(actions._deleteTask(id), expectedAction);
  });
});

describe('action - `markAsDirty`', function () {
  it('should create an action to mark a task as dirty by id', function () {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.MARK_AS_DIRTY,
      id,
    };
    expectDeepEqual(actions.markAsDirty(id), expectedAction);
  });
});

describe('action - `unmarkDirty`', function () {
  it('should create an action to mark a task as undirty by id', function () {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.UNMARK_DIRTY,
      id,
    };
    expectDeepEqual(actions.unmarkDirty(id), expectedAction);
  });
});

describe('action - `_markDone`', function () {
  it('should create an action to mark a task as done', function () {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.MARK_DONE,
      id,
    };
    expectDeepEqual(actions._markDone(id), expectedAction);
  });
});

describe('action - `_unmarkDone`', function () {
  it('should create an action to mark a task as undone', function () {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.UNMARK_DONE,
      id,
    };
    expectDeepEqual(actions._unmarkDone(id), expectedAction);
  });
});

describe('action - `_createMilestone`', function () {
  it('should create an action to create a new milestone', function () {
    const milestone = {
      id: 'milestone161',
      content: 'milestone 3',
      deadline: null,
      project_id: '4JjOdFAdz',
      tasks: [],
    };
    const expectedAction = {
      type: types.CREATE_MILESTONE,
      milestone,
    };
    expectDeepEqual(actions._createMilestone(milestone), expectedAction);
  });
});

describe('action - `_deleteMilestone`', function () {
  it('should create an action to delete a milestone by id', function () {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.DELETE_MILESTONE,
      id,
    };
    expectDeepEqual(actions._deleteMilestone(id), expectedAction);
  });
});


describe('action - `_editMilestone`', function () {
  it('should create an action to edit a milestone by id', function () {
    const id = 'sadkfjl213skafj134';
    const milestone = {
      content: 'milestone 32',
      deadline: null,
      github_token: null,
    };
    const expectedAction = {
      type: types.EDIT_MILESTONE,
      id,
      milestone,
    };
    expectDeepEqual(actions._editMilestone(id, milestone), expectedAction);
  });
});

describe('action - `_createProject`', function () {
  it('should create an action to create a new project', function () {
    const project = {
      id: 'Nypw1dJtz',
      content: 'abc',
      creator: 'EkD69ORwf',
      basic: [],
      pending: [],
      milestones: [],
      root_folder: null,
      directory_structure: [],
      files_loaded: false,
    };
    const expectedAction = {
      type: types.CREATE_PROJECT,
      project,
    };
    expectDeepEqual(actions._createProject(project), expectedAction);
  });
});

describe('action - `_deleteProject`', function () {
  it('should create an action to delete a project by id', function () {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.DELETE_PROJECT,
      id,
    };
    expectDeepEqual(actions._deleteProject(id), expectedAction);
  });
});

describe('action - `replaceProjectId`', function () {
  it('should create an action to replace project id', function () {
    const original = 'taskid1231';
    const replacement = 'safjkl13lkvaklaksdj';
    const expectedAction = {
      type: types.REPLACE_PROJECT_ID,
      original,
      replacement,
    };
    expectDeepEqual(actions.replaceProjectId(original, replacement), expectedAction);
  });
});

describe('action - `_switchToProject`', function () {
  it('should create an action to switch to another project', function () {
    const project_id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.SWITCH_TO_PROJECT,
      project_id,
    };
    expectDeepEqual(actions._switchToProject(project_id), expectedAction);
  });
});


describe('action - `projectAlert`', function () {
  it('should create an action to alert on project', function () {
    const alert = 'INVITED_TO_PROJECT';
    const expectedAction = {
      type: types.PROJECT_INVITATION_ALERT,
      alert,
    };
    expectDeepEqual(actions.projectAlert(alert), expectedAction);
  });
});

describe('action - `_updateProject`', function () {
  it('should create an action to switch to another project', function () {
    const id = 'askldfj132';
    const payload = {
      directory_structure: [
        {
          name: 'Top level directory',
          id: 'root',
        },
      ],
    };
    const expectedAction = {
      type: types.UPDATE_PROJECT,
      id,
      payload,
    };
    expectDeepEqual(actions._updateProject(id, payload), expectedAction);
  });
});

describe('action - `joinProject`', function () {
  it('should create an action to let user join a project', function () {
    const id = 'askldfj132';
    const user_id = 'sjf31134';
    const expectedAction = {
      type: types.JOIN_PROJECT,
      id,
      user_id,
    };
    expectDeepEqual(actions.joinProject(id, user_id), expectedAction);
  });
});

describe('action - `initSearchResults`', function () {
  it('should create an action to init search results', function () {
    const results = [];
    const expectedAction = {
      type: types.INIT_RESULTS,
      results,
    };
    expectDeepEqual(actions.initSearchResults(results), expectedAction);
  });
});

describe('action - `addSearchResults`', function () {
  it('should create an action to add search results', function () {
    const results = [
      {
        id: '0B0-lEWDVaUMROEJna0diRFd5MG8',
        primaryText: 'Queries 1 (Iteration 1).txt',
        secondaryText: 'Chia Kai Tan',
        link: 'https://drive.google.com/file/d/0B0-lEWDVaUMROEJna0diRFd5MG8/view?usp=drivesdk',
        thumbnail: 'https://ssl.gstatic.com/docs/doclist/images/icon_10_text_list.png',
        modifiedTime: '2015-09-06T19:28:06.956Z',
        type: 'drive',
      },
    ];
    const expectedAction = {
      type: types.ADD_RESULTS,
      results,
    };
    expectDeepEqual(actions.addSearchResults(results), expectedAction);
  });
});
describe('action - `queryProcessing`', function () {
  it('should create an action to show query in process', function () {
    const expectedAction = {
      type: types.QUERY_PROCESSING,
    };
    expectDeepEqual(actions.queryProcessing(), expectedAction);
  });
});

describe('action - `queryDone`', function () {
  it('should create an action to show query done', function () {
    const expectedAction = {
      type: types.QUERY_DONE,
    };
    expectDeepEqual(actions.queryDone(), expectedAction);
  });
});

describe('action - `initSnackbar`', function () {
  it('should create an action to init snack bar', function () {
    const snackbar = {
      isOpen: false,
      message: 'Task reopened',
      background: 'rgba(0, 0, 0, 0.870588)',
    };
    const expectedAction = {
      type: types.INIT_SNACKBAR,
      snackbar,
    };
    expectDeepEqual(actions.initSnackbar(snackbar), expectedAction);
  });
});

describe('action - `initApp`', function () {
  it('should create an action to init app', function () {
    const app = {
      is_linked_to_drive: true,
      is_top_level_folder_loaded: false,
      github: {
        loading: false,
        repo_fetched: false,
      },
      files: {
        loading: false,
      },
      queriesInProgress: 0,
      loading: true,
      queryString: '',
      searchFilter: 'all',
    };
    const expectedAction = {
      type: types.INIT_APP,
      app,
    };
    expectDeepEqual(actions.initApp(app), expectedAction);
  });
});

describe('action - `initMilestones`', function () {
  it('should create an action to init milestones', function () {
    const milestones = [
      {
        id: '4JeJBs0dz',
        content: 'M12',
        deadline: null,
        github_id: null,
        github_number: null,
        created_at: '2017-02-16T14:22:55.000Z',
        updated_at: '2017-02-16T14:23:01.000Z',
        project_id: '4JjOdFAdz',
        tasks: [],
      },
    ];
    const expectedAction = {
      type: types.INIT_MILESTONES,
      milestones,
    };
    expectDeepEqual(actions.initMilestones(milestones), expectedAction);
  });
});
describe('action - `initNotifications`', function () {
  it('should create an action to init notifications', function () {
    const notifications = [
      {
        id: '4Jdne0IOf',
        text: 'Ge Hu has joined the project b',
        time: '2017-02-10T15:51:51.000Z',
        read: false,
        link: '',
        type: 'JOINED_PROJECT',
        meta: {
          user_id: 'Nk89qOUdM',
          project_id: 'Vyb7JRXuf',
        },
      },
    ];
    const expectedAction = {
      type: types.INIT_NOTIFICATIONS,
      notifications,
    };
    expectDeepEqual(actions.initNotifications(notifications), expectedAction);
  });
});

describe('action - `initProjects`', function () {
  it('should create an action to init projects', function () {
    const projects = [
      {
        id: 'EkTq9OUdG',
        content: 'cs2103',
        milestones: [
          '4JeJBs0dz',
          'V1BBAPyKz',
          '4JqP7Kt_f',
          'Eyz0rITuG',
        ],
        tasks: [
          'NyfWnuKuG',
          'V1BCg8pdM',
          'VJ-xTf3uM',
          'Vy_oBLpdM',
        ],
        creator: 'Nk89qOUdM',
        basic: [
          'EkD69ORwf',
        ],
        pending: [],
        root_folder: '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
        directory_structure: [],
        files_loaded: false,
        github_repo_name: null,
        github_repo_owner: null,
        chatroom: null,
      },
    ];
    const expectedAction = {
      type: types.INIT_PROJECTS,
      projects,
    };
    expectDeepEqual(actions.initProjects(projects), expectedAction);
  });
});
describe('action - `initTasks`', function () {
  it('should create an action to init tasks', function () {
    const tasks = [
      {
        id: '4169puFOf',
        content: 'gzhenxin',
        completed_on: null,
        github_id: null,
        github_number: null,
        assignee_id: '',
        created_at: '2017-02-12T16:34:04.000Z',
        updated_at: '2017-02-15T17:03:19.000Z',
        milestone_id: null,
        project_id: 'EkTq9OUdG',
      },
    ];
    const expectedAction = {
      type: types.INIT_TASKS,
      tasks,
    };
    expectDeepEqual(actions.initTasks(tasks), expectedAction);
  });
});
describe('action - `initUsers`', function () {
  it('should create an action to init users', function () {
    const users = [
      {
        id: 'EkD69ORwf',
        email: 'zhangji951027@gmail.com',
        display_name: 'JJ Zhang',
        display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
        online: true,
        colour: '#e91e63',
        me: true,
      },
    ];
    const expectedAction = {
      type: types.INIT_USERS,
      users,
    };
    expectDeepEqual(actions.initUsers(users), expectedAction);
  });
});

describe('action - `initFiles`', function () {
  it('should create an action to init files', function () {
    const files = [];
    const expectedAction = {
      type: types.INIT_FILES,
      files,
    };
    expectDeepEqual(actions.initFiles(files), expectedAction);
  });
});

describe('action - `initMessages`', function () {
  it('should create an action to init messages', function () {
    const messages = [];
    const expectedAction = {
      type: types.INIT_MESSAGES,
      messages,
    };
    expectDeepEqual(actions.initMessages(messages), expectedAction);
  });
});

describe('action - `_initGithubRepos`', function () {
  it('should create an action to init github repos', function () {
    const repos = [];
    const expectedAction = {
      type: types.INIT_GITHUB_REPOS,
      repos,
    };
    expectDeepEqual(actions._initGithubRepos(repos), expectedAction);
  });
});

describe('action - `addNewsfeedEvents`', function () {
  it('should create an action to add newsfeed events', function () {
    const events = [
      {
        id: 'VkOQVFJKG',
        data: '{"user_id":"EkD69ORwf","fileName":"b.txt"}',
        template: 'DRIVE_UPLOAD',
        project_id: 'EkTq9OUdG',
        source: 'GOOGLE_DRIVE',
        created_at: '2017-02-17T06:15:35.488Z',
        updated_at: '2017-02-17T06:15:35.000Z',
      },
    ];
    const expectedAction = {
      type: types.ADD_EVENT,
      events,
    };
    expectDeepEqual(actions.addNewsfeedEvents(events), expectedAction);
  });
});

describe('action - `loggedOutGoogle`', function () {
  it('should create an action to log out of google', function () {
    const expectedAction = {
      type: types.LOGGED_OUT_GOOGLE,
    };
    expectDeepEqual(actions.loggedOutGoogle(), expectedAction);
  });
});

describe('action - `loggedIntoGoogle`', function () {
  it('should create an action to log out of google', function () {
    const expectedAction = {
      type: types.LOGGED_INTO_GOOGLE,
    };
    expectDeepEqual(actions.loggedIntoGoogle(), expectedAction);
  });
});

describe('action - `insertFile`', function () {
  it('should create an action to insert a single file', function () {
    const file = {
      id: '0B6AfgueBZ9TMU29UTFlSVjVJdEk',
      name: 'b.txt',
      mimeType: 'text/plain',
      parents: [
        '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
      ],
      webViewLink: 'https://drive.google.com/file/d/0B6AfgueBZ9TMU29UTFlSVjVJdEk/view?usp=drivesdk',
      iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_10_text_list.png',
      modifiedTime: '2017-02-17T06:15:34.365Z',
      lastModifyingUser: {
        kind: 'drive#user',
        displayName: 'JJ Zhang',
        photoLink: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/s64/photo.jpg',
        me: true,
        permissionId: '05656636532801173373',
        emailAddress: 'zhangji951027@gmail.com',
      },
    };
    const expectedAction = {
      type: types.INSERT_FILE,
      file,
    };
    expectDeepEqual(actions.insertFile(file), expectedAction);
  });
});

describe('action - `addFiles`', function () {
  it('should create an action to add multiple files', function () {
    const files = [
      {
        id: '0B6AfgueBZ9TMU29UTFlSVjVJdEk',
        name: 'b.txt',
        mimeType: 'text/plain',
        parents: [
          '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
        ],
        webViewLink: 'https://drive.google.com/file/d/0B6AfgueBZ9TMU29UTFlSVjVJdEk/view?usp=drivesdk',
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_10_text_list.png',
        modifiedTime: '2017-02-17T06:15:34.365Z',
        lastModifyingUser: {
          kind: 'drive#user',
          displayName: 'JJ Zhang',
          photoLink: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/s64/photo.jpg',
          me: true,
          permissionId: '05656636532801173373',
          emailAddress: 'zhangji951027@gmail.com',
        },
      },
    ];
    const expectedAction = {
      type: types.ADD_FILES,
      files,
    };
    expectDeepEqual(actions.addFiles(files), expectedAction);
  });
});

describe('action - `deleteFile`', function () {
  it('should create an action to delete file', function () {
    const id = '0B6AfgueBZ9TMU29UTFlSVjVJdEk';
    const expectedAction = {
      type: types.DELETE_FILE,
      id,
    };
    expectDeepEqual(actions.deleteFile(id), expectedAction);
  });
});

describe('action - `updateFile`', function () {
  it('should create an action update a file', function () {
    const id = '0B6AfgueBZ9TMU29UTFlSVjVJdEk';
    const payload = {
      uploading: true,
    };
    const expectedAction = {
      type: types.UPDATE_FILE,
      id,
      payload,
    };
    expectDeepEqual(actions.updateFile(id, payload), expectedAction);
  });
});

describe('action - `addDirectory`', function () {
  it('should create an action to add a directory', function () {
    const id = '0B6AfgueBZ9TMU29UTFlSVjVJdEk';
    const directory = {
      id: '0B6AfgueBZ9TMNFl2Q1o1dHNBWlE',
      name: 'some thing so coolaas',
    };
    const expectedAction = {
      type: types.ADD_DIRECTORY,
      id,
      directory,
    };
    expectDeepEqual(actions.addDirectory(id, directory), expectedAction);
  });
});

describe('action - `goToDirectory`', function () {
  it('should create an action to go to directory', function () {
    const projectId = '0B6AfgueBZ9TMU29UTFlSVjVJdEk';
    const dirId = 'adf23v1';
    const expectedAction = {
      type: types.GO_TO_DIRECTORY,
      projectId,
      dirId,
    };
    expectDeepEqual(actions.goToDirectory(projectId, dirId), expectedAction);
  });
});

describe('action - `_setDirectoryAsRoot`', function () {
  it('should create an action to set folder as directory root', function () {
    const projectId = '0B6AfgueBZ9TMU29UTFlSVjVJdEk';
    const dirId = 'adf23v1';
    const expectedAction = {
      type: types.SET_DIRECTORY_AS_ROOT,
      projectId,
      dirId,
    };
    expectDeepEqual(actions._setDirectoryAsRoot(projectId, dirId), expectedAction);
  });
});

describe('action - `_setDefaultGithubRepo`', function () {
  it('should create an action to set default github repo', function () {
    const projectId = '0B6AfgueBZ9TMU29UTFlSVjVJdEk';
    const repoName = 'repoName';
    const repoOwner = '231r31feq';
    const expectedAction = {
      type: types.SET_GITHUB_REPO,
      projectId,
      repoName,
      repoOwner,
    };
    expectDeepEqual(actions._setDefaultGithubRepo(projectId, repoName, repoOwner), expectedAction);
  });
});

describe('action - `addMessage`', function () {
  it('should create an action to add a message', function () {
    const message = 'message';
    const expectedAction = {
      type: types.ADD_MESSAGE,
      message,
    };
    expectDeepEqual(actions.addMessage(message), expectedAction);
  });
});

describe('action - `userOnline`', function () {
  it('should create an action to notfiy user is online', function () {
    const id = 'id';
    const expectedAction = {
      type: types.USER_ONLINE,
      id,
    };
    expectDeepEqual(actions.userOnline(id), expectedAction);
  });
});

describe('action - `userOffline`', function () {
  it('should create an action to notfiy user is offline', function () {
    const id = 'id';
    const expectedAction = {
      type: types.USER_OFFLINE,
      id,
    };
    expectDeepEqual(actions.userOffline(id), expectedAction);
  });
});


describe('action - `addUsers`', function () {
  it('should create an action to add multiple users', function () {
    const users = [];
    const expectedAction = {
      type: types.ADD_USERS,
      users,
    };
    expectDeepEqual(actions.addUsers(users), expectedAction);
  });
});

describe('action - `userEditing`', function () {
  it('should create an action to notfiy user is editing', function () {
    const kind = 'milestone';
    const id = 'sfa1321e';
    const user_id = 'sadf21380914';
    const expectedAction = {
      type: types.USER_EDITING,
      kind,
      id,
      user_id,
    };
    expectDeepEqual(actions.userEditing(kind, id, user_id), expectedAction);
  });
});

describe('action - `userStopEditing`', function () {
  it('should create an action to notfiy user stops editing', function () {
    const kind = 'milestone';
    const id = 'sfa1321e';
    const user_id = 'sadf21380914';
    const expectedAction = {
      type: types.USER_STOP_EDITING,
      kind,
      id,
      user_id,
    };
    expectDeepEqual(actions.userStopEditing(kind, id, user_id), expectedAction);
  });
});

describe('action - `newNotification`', function () {
  it('should create an action to notfiy user stops editing', function () {
    const notif = {
      id: 'V1iMfOJFf',
      text: 'Ge Hu has joined the project abc',
      time: '2017-02-17T04:58:35.000Z',
      read: false,
      link: '',
      type: 'JOINED_PROJECT',
      meta: {
        user_id: 'Nk89qOUdM',
        project_id: 'Nypw1dJtz',
      },
    };
    const expectedAction = {
      type: types.NEW_NOTIFICATION,
      notif,
    };
    expectDeepEqual(actions.newNotification(notif), expectedAction);
  });
});

describe('action - `_deleteNotification`', function () {
  it('should create an action to notfiy user stops editing', function () {
    const id = 'V1iMfOJFf';
    const expectedAction = {
      type: types.DELETE_NOTIFICATION,
      id,
    };
    expectDeepEqual(actions._deleteNotification(id), expectedAction);
  });
});
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const initialState = {
  milestones: [
    {
      id: 'Eyz0rITuG',
      content: 'a',
      deadline: null,
      github_id: null,
      github_number: null,
      created_at: '2017-02-15T14:33:21.000Z',
      updated_at: '2017-02-15T14:33:21.000Z',
      project_id: 'EkTq9OUdG',
      tasks: [
        '4y-jjP1tG',
        'E1bQiD1Ff',
      ],
    },
  ],
  notifications: [
    {
      id: '4kfzxCUuM',
      text: 'Ge Hu has joined the project a',
      time: '2017-02-10T15:49:05.000Z',
      read: false,
      link: '',
      type: 'JOINED_PROJECT',
      meta: {
        user_id: 'Nk89qOUdM',
        project_id: 'Vy0p9_AvG',
      },
    },
  ],
  projects: [
    {
      id: 'Vyb7JRXuf',
      content: 'project',
      milestones: [
        '4JeJBs0dz',
        'V1BBAPyKz',
        '4JqP7Kt_f',
        'Eyz0rITuG',
      ],
      tasks: [
        '4169puFOf',
        '41JNzgidG',
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
  tasks: [
    {
      id: 'Vy_oBLpdM',
      content: 'a',
      completed_on: null,
      github_id: null,
      github_number: null,
      assignee_id: '',
      created_at: '2017-02-15T14:32:39.000Z',
      updated_at: '2017-02-16T14:23:16.000Z',
      milestone_id: '4JqP7Kt_f',
      project_id: 'EkTq9OUdG',
    },
  ],
  users: [
    {
      id: 'EkD69ORwf',
      email: 'zhangji951027@gmail.com',
      display_name: 'JJ Zhang',
      display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
      online: true,
      colour: '#e91e63',
      me: true,
    },
  ],
  alerts: {
    project_invitation: null,
  },
  app: {
    is_linked_to_drive: true,
    is_top_level_folder_loaded: true,
    github: {
      loading: false,
    },
    files: {
      loading: false,
    },
    queriesInProgress: 0,
    loading: false,
    queryString: '',
    searchFilter: 'all',
    current_project: '4JjOdFAdz',
    github_token: '',
  },
  files: [
    {
      id: '0B6AfgueBZ9TMZndEV3JHbUFtSkE',
      name: 'New Folder',
      mimeType: 'application/vnd.google-apps.folder',
      parents: [
        '0B6AfgueBZ9TMcTUwNmYyZ1FRNGc',
      ],
      webViewLink: 'https://drive.google.com/drive/folders/0B6AfgueBZ9TMZndEV3JHbUFtSkE',
      iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_11_collection_list_1.png',
      modifiedTime: '2017-02-17T06:24:34.423Z',
      lastModifyingUser: {
        kind: 'drive#user',
        displayName: 'JJ Zhang',
        photoLink: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/s64/photo.jpg',
        me: true,
        permissionId: '05656636532801173373',
        emailAddress: 'zhangji951027@gmail.com',
      },
    },
  ],
  githubRepos: [],
  newsfeed: [
    {
      id: 'E183suCPf',
      data: '{"user_id":"EkD69ORwf","fileName":"BBQ.txt"}',
      template: 'DRIVE_UPLOAD',
      source: 'GOOGLE_DRIVE',
      created_at: '2017-02-04T08:11:01.000Z',
      updated_at: '2017-02-04T08:11:01.000Z',
      project_id: 'Vy0p9_AvG',
    },
  ],
  search: [],
  snackbar: {
    isOpen: false,
    message: 'New Folder created successfully',
    background: 'rgba(0, 0, 0, 0.870588)',
  },

};
describe('thunk action - `addUser`', function () {
  beforeEach('stub ', function () {
    this.stub = sinon.stub(general, 'getNewColour').returns('#color');
  });
  afterEach('reset stub', function () {
    this.stub.restore();
  });
  const store = mockStore(initialState);
  it('should dispatch addUsers with single elements', function () {
    const user = {
      id: 'EkD69ORwf',
      email: 'zhangji951027@gmail.com',
      display_name: 'JJ Zhang',
      display_image: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/photo.jpg?sz=50',
      online: true,
      me: true,
      colour: '#color'
    };
    const users = [user];
    const expectedAction = [
      {
        type: types.ADD_USERS,
        users,
      },
    ];
    store.dispatch(actions.addUser(user));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `moveFileToDrive`', function () {
  const fileId = '0B6AfgueBZ9TMZndEV3JHbUFtSkE';
  const oldParents = ['oldParentId'];
  const newParents = ['newParentId'];
  const oldFile = {
    id: fileId,
    name: 'New Folder',
    mimeType: 'application/vnd.google-apps.folder',
    parents: oldParents,
    webViewLink: 'https://drive.google.com/drive/folders/0B6AfgueBZ9TMZndEV3JHbUFtSkE',
    iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_11_collection_list_1.png',
    modifiedTime: '2017-02-17T06:24:34.423Z',
    lastModifyingUser: {
      kind: 'drive#user',
      displayName: 'JJ Zhang',
      photoLink: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/s64/photo.jpg',
      me: true,
      permissionId: '05656636532801173373',
      emailAddress: 'zhangji951027@gmail.com',
    },
  };
  const newFile = assign({}, oldFile, {
    parents: newParents,
  });
  beforeEach(function () {
    this.stub = sinon.stub(apiUtil, 'moveFile').returnsPromise();
  });
  afterEach(function () {
    this.stub.restore();
  });
  it('can resolve', function () {
    const expectedAction = [
      {
        type: types.DELETE_FILE,
        id: fileId,
      },
      {
        type: types.INSERT_FILE,
        file: newFile,
      },
      {
        type: types.SNACKBAR_MESSAGE,
        kind: 'default',
        message: `${newFile.name} moved successfully`,
      },
    ];
    this.stub.resolves(newFile);
    const store = mockStore(initialState);
    store.dispatch(actions.moveFileToDrive(fileId, oldParents, newParents));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `createFolderToDrive`', function () {
  const directory = 'ZndEV3JHbUFtSkM0B6AfgueBZ9TM';
  const newFile = {
    id: '0B6AfgueBZ9TMZndEV3JHbUFtSkE',
    name: 'New Folder',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['ZndEV3JHbUFtSkM0B6AfgueBZ9TM'],
    webViewLink: 'https://drive.google.com/drive/folders/0B6AfgueBZ9TMZndEV3JHbUFtSkE',
    iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_11_collection_list_1.png',
    modifiedTime: '2017-02-17T06:24:34.423Z',
    lastModifyingUser: {
      kind: 'drive#user',
      displayName: 'JJ Zhang',
      photoLink: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/s64/photo.jpg',
      me: true,
      permissionId: '05656636532801173373',
      emailAddress: 'zhangji951027@gmail.com',
    },
  };
  beforeEach(function () {
    this.stub = sinon.stub(apiUtil, 'createFolder').returnsPromise();
  });
  afterEach(function () {
    this.stub.restore();
  });
  it('can resolve', function () {
    const expectedAction = [
      {
        type: types.INSERT_FILE,
        file: newFile,
      },
      {
        type: types.SNACKBAR_MESSAGE,
        kind: 'default',
        message: `${newFile.name} created successfully`,
      },
    ];
    this.stub.resolves(newFile);
    const store = mockStore(initialState);
    store.dispatch(actions.createFolderToDrive(directory));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `renameFileToDrive`', function () {
  const fileId = '0B6AfgueBZ9TMZndEV3JHbUFtSkE';
  const newName = 'newName';
  const newFile = {
    id: fileId,
    name: newName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['ZndEV3JHbUFtSkM0B6AfgueBZ9TM'],
    webViewLink: 'https://drive.google.com/drive/folders/0B6AfgueBZ9TMZndEV3JHbUFtSkE',
    iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_11_collection_list_1.png',
    modifiedTime: '2017-02-17T06:24:34.423Z',
    lastModifyingUser: {
      kind: 'drive#user',
      displayName: 'JJ Zhang',
      photoLink: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/s64/photo.jpg',
      me: true,
      permissionId: '05656636532801173373',
      emailAddress: 'zhangji951027@gmail.com',
    },
  };
  beforeEach(function () {
    this.stub = sinon.stub(apiUtil, 'renameFile').returnsPromise();
  });
  afterEach(function () {
    this.stub.restore();
  });
  it('can resolve', function () {
    const expectedAction = [
      {
        type: types.DELETE_FILE,
        id: fileId,
      },
      {
        type: types.INSERT_FILE,
        file: newFile,
      },
      {
        type: types.SNACKBAR_MESSAGE,
        kind: 'default',
        message: `${newFile.name} renamed successfully`,
      },
    ];
    this.stub.resolves(newFile);
    const store = mockStore(initialState);
    store.dispatch(actions.renameFileToDrive(fileId, newName));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `copyFileToDrive`', function () {
  const fileId = '0B6AfgueBZ9TMZndEV3JHbUFtSkE';
  const newFile = {
    id: 'NewfileId',
    name: 'fileName',
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['ZndEV3JHbUFtSkM0B6AfgueBZ9TM'],
    webViewLink: 'https://drive.google.com/drive/folders/0B6AfgueBZ9TMZndEV3JHbUFtSkE',
    iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_11_collection_list_1.png',
    modifiedTime: '2017-02-17T06:24:34.423Z',
    lastModifyingUser: {
      kind: 'drive#user',
      displayName: 'JJ Zhang',
      photoLink: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/s64/photo.jpg',
      me: true,
      permissionId: '05656636532801173373',
      emailAddress: 'zhangji951027@gmail.com',
    },
  };
  beforeEach(function () {
    this.stub = sinon.stub(apiUtil, 'copyFile').returnsPromise();
  });
  afterEach(function () {
    this.stub.restore();
  });
  it('can resolve', function () {
    const expectedAction = [
      {
        type: types.INSERT_FILE,
        file: newFile,
      },
      {
        type: types.SNACKBAR_MESSAGE,
        kind: 'default',
        message: `${newFile.name} copied successfully`,
      },
    ];
    this.stub.resolves(newFile);
    const store = mockStore(initialState);
    store.dispatch(actions.copyFileToDrive(fileId));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `removeFileFromDrive`', function () {
  const fileId = '0B6AfgueBZ9TMZndEV3JHbUFtSkE';

  beforeEach(function () {
    this.stub = sinon.stub(apiUtil, 'removeFile').returnsPromise();
  });
  afterEach(function () {
    this.stub.restore();
  });
  it('can resolve', function () {
    const expectedAction = [
      {
        type: types.DELETE_FILE,
        id: fileId,
      },
      {
        type: types.SNACKBAR_MESSAGE,
        kind: 'default',
        message: 'File deleted successfully',
      },
    ];
    this.stub.resolves();
    const store = mockStore(initialState);
    store.dispatch(actions.removeFileFromDrive(fileId));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});
// TODO unable to mock async function of FileReader.readAsDataURL
describe.skip('thunk action - `uploadFileToDrive`', function () {
  const uploadFile = {
    id: 'previewId321',
    data: 'fileData',
    isPreview: true,
    name: 'b.txt',
  };
  const directory = '9TMZndEV3JHbUFtSkE0B6AfgueBZ';
  const projectId = '2dE4V3JH';
  const newFile = {
    id: 'NewfileId',
    name: uploadFile.name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['ZndEV3JHbUFtSkM0B6AfgueBZ9TM'],
    webViewLink: 'https://drive.google.com/drive/folders/0B6AfgueBZ9TMZndEV3JHbUFtSkE',
    iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_11_collection_list_1.png',
    modifiedTime: '2017-02-17T06:24:34.423Z',
    lastModifyingUser: {
      kind: 'drive#user',
      displayName: 'JJ Zhang',
      photoLink: 'https://lh5.googleusercontent.com/-7N48g0fA8Lg/AAAAAAAAAAI/AAAAAAAAAZ0/zD3xNHc_Smo/s64/photo.jpg',
      me: true,
      permissionId: '05656636532801173373',
      emailAddress: 'zhangji951027@gmail.com',
    },
  };
  beforeEach(function () {
    this.stub = sinon.stub(apiUtil, 'uploadFile').returnsPromise();
    this.spy = sinon.stub(FileReader.prototype, 'readAsDataURL');
  });
  afterEach(function () {
    this.stub.restore();
    this.spy.restore();
  });
  it('can resolve', function () {
    const expectedAction = [
      {
        type: types.DELETE_FILE,
        id: uploadFile.id,
      },
      {
        type: types.INSERT_FILE,
        file: newFile,
      },
      {
        type: types.SNACKBAR_MESSAGE,
        kind: 'default',
        message: `${newFile.name} uploaded successfully`,
      },
    ];
    this.stub.resolves(newFile);
    const store = mockStore(initialState);
    store.dispatch(actions.uploadFileToDrive(uploadFile, directory, projectId));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `updateGithubLogin`', function () {
  beforeEach(function () {
    this.stub = sinon.stub(apiUtil, 'serverUpdateGithubLogin');
  });
  afterEach(function () {
    this.stub.restore();
  });
  const token = 'saf31uroiflkasj34';
  it('should call serverUpdateGithubLogin', function () {
    const store = mockStore(initialState);
    store.dispatch(actions.updateGithubLogin(token));
    expect(this.stub.calledOnce).to.equal(true);
    expect(this.stub.calledWith(token)).to.equal(true);
  });
});

describe.skip('thunk action - `queryIntegrations`', function () {
  const queryString = '.txt';
  beforeEach(function () {
    this.queryGoogleDriveStub = sinon.stub(apiUtil, 'serverUpdateGithubLogin');
    this.queryGithubStub = sinon.stub(apiUtil, 'queryGithub');
    this.queryGoogleDriveStub = sinon.stub(apiUtil, 'serverUpdateGithubLogin');
  });
  afterEach(function () {
    this.queryGoogleDriveStub.restore();
    this.queryGithubStub.restore();
    this.queryGoogleDriveStub.restore();
  });
  it('can resolve', function () {
    const expectedAction = [];
    const store = mockStore(initialState);
    store.dispatch(actions.queryIntegrations(queryString));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `initGithubRepos`', function () {
  const repos = [
    {
      name: 'repo1',
      url: 'www.github.com/safd',
    },
  ];
  beforeEach(function () {
    this.stub = sinon.stub(apiUtil, 'getGithubRepos').returnsPromise();
  });
  afterEach(function () {
    this.stub.restore();
  });
  it('can resolve', function () {
    const expectedAction = [
      {
        type: types.UPDATE_APP_STATUS,
        app: {
          github: {
            loading: true,
          },
        },
      },
      {
        type: types.UPDATE_APP_STATUS,
        app: {
          github: {
            loading: false,
            repo_fetched: true,
          },
        },
      },
      {
        type: types.INIT_GITHUB_REPOS,
        repos,
      },
    ];
    const store = mockStore(initialState);
    this.stub.resolves(repos);
    store.dispatch(actions.initGithubRepos());
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `updateAppStatus`', function () {
  it('should call _updateAppStatus', function () {
    const obj = {
      github: {
        loading: true,
      },
    };
    const expectedAction = [
      {
        type: types.UPDATE_APP_STATUS,
        app: obj,
      },
    ];
    const store = mockStore(initialState);
    store.dispatch(actions.updateAppStatus(obj));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `dismissProjectAlert`', function () {
  it('should call projectAlert', function () {
    const expectedAction = [
      {
        type: types.PROJECT_INVITATION_ALERT,
        alert: null,
      },
    ];
    const store = mockStore(initialState);
    store.dispatch(actions.dismissProjectAlert());
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe('thunk action - `declineProject`', function () {
  const projectId = 'safjlk23e1';
  const notificationId = 'saf2131afd';
  beforeEach(function () {
    this.declineProjectStub = sinon.stub(apiUtil, 'serverDeclineProject').returnsPromise();
    this.deleteNotificationStub = sinon.stub(apiUtil, 'serverDeleteNotification').returnsPromise();
  });
  afterEach(function () {
    this.declineProjectStub.restore();
    this.deleteNotificationStub.restore();
  });
  it('can resolve', function () {
    const expectedAction = [
      {
        type: types.SNACKBAR_MESSAGE,
        kind: 'default',
        message: 'Project declined',
      },
      {
        type: types.DELETE_NOTIFICATION,
        id: notificationId,
      },
    ];
    const store = mockStore(initialState);
    this.declineProjectStub.resolves();
    this.deleteNotificationStub.resolves();
    store.dispatch(actions.declineProject(projectId, notificationId));
    expectDeepEqual(store.getActions(), expectedAction);
  });
  it('can fail', function () {
    const expectedAction = [];
    const store = mockStore(initialState);
    this.declineProjectStub.rejects();
    this.deleteNotificationStub.rejects();
    store.dispatch(actions.declineProject(projectId, notificationId));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});

describe.skip('thunk action - `acceptProject`', function () {
});
describe.skip('thunk action - `initializeApp`', function () {
});
describe.skip('thunk action - `initializeFiles`', function () {
});
describe.skip('thunk action - `markDone`', function () {
});
describe.skip('thunk action - `addTask`', function () {
});
describe.skip('thunk action - `deleteTask`', function () {
});
describe.skip('thunk action - `editTask`', function () {
});
describe.skip('thunk action - `editMilestone`', function () {
});
describe.skip('thunk action - `createMilestone`', function () {
});
describe.skip('thunk action - `deleteMilestone`', function () {
});
describe.skip('thunk action - `createProject`', function () {
});
describe.skip('thunk action - `inviteToProject`', function () {
});
describe.skip('thunk action - `reopenTask`', function () {
});
describe.skip('thunk action - `initTopLevelFolders`', function () {
});
describe.skip('thunk action - `initChildrenFiles`', function () {
});
describe.skip('thunk action - `initTopLevelFolders`', function () {
});
describe.skip('thunk action - `initUpperLevelFolder`', function () {
});
describe.skip('thunk action - `setDirectoryAsRoot`', function () {
});
describe.skip('thunk action - `syncWithGithub`', function () {
});
describe.skip('thunk action - `updateProject`', function () {
});
describe.skip('thunk action - `renameProject`', function () {
});
describe.skip('thunk action - `switchToProject`', function () {
  const project = {
    id: 'Vyb7JRXuf',
    content: 'project',
    milestones: [
      '4JeJBs0dz',
      'V1BBAPyKz',
      '4JqP7Kt_f',
      'Eyz0rITuG',
    ],
    tasks: [
      '4169puFOf',
      '41JNzgidG',
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
    github_repo_owner: 'a135766066825',
    chatroom: null,
  };
  it('should call initGithubRepos() if repo_fetched and project has undefined github_repo_name',
  function () {
    const expectedAction = [
    ];
    const customState = assign({}, initialState, {
      app: {
        github: {
          repo_fetched: false,
        },
      },
    });
    const store = mockStore(customState);
    store.dispatch(actions.switchToProject(project));
    expectDeepEqual(store.getActions(), expectedAction);
  });
});
describe.skip('thunk action - `changeChatRoom`', function () {
});
describe.skip('thunk action - `switchChatRoom`', function () {
});
describe.skip('thunk action - `loadChatRoom`', function () {
});
