import { expect } from 'chai';

import * as actions from '../../js/actions/ReduxTaskActions.js';
import * as types from '../../js/AppConstants.js';

const expectDeepEqual = (obj1, obj2) => {
  expect(obj1).to.deep.equal(obj2);
};
/* eslint no-underscore-dangle: "off" */
describe('action - `_updateAppStatus`', () => {
  it('should create an action to update app status', () => {
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

describe('action - `snackbarMessage`', () => {
  it('should create an action to trigger snackbar message', () => {
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

describe('action - `updateSnackbar`', () => {
  it('should create an action to update snackbar', () => {
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

describe('action - `replaceTaskId`', () => {
  it('should create an action to replace task id', () => {
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

describe('action - `replaceMilestoneId`', () => {
  it('should create an action to replace task id', () => {
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

describe('action - `_addTask`', () => {
  it('should create an action to add a new task', () => {
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

describe('action - `_editTask`', () => {
  it('should create an action to edit a task with id', () => {
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

describe('action - `_deleteTask`', () => {
  it('should create an action to delete a task by id', () => {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.DELETE_TASK,
      id,
    };
    expectDeepEqual(actions._deleteTask(id), expectedAction);
  });
});

describe('action - `markAsDirty`', () => {
  it('should create an action to mark a task as dirty by id', () => {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.MARK_AS_DIRTY,
      id,
    };
    expectDeepEqual(actions.markAsDirty(id), expectedAction);
  });
});

describe('action - `unmarkDirty`', () => {
  it('should create an action to mark a task as undirty by id', () => {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.UNMARK_DIRTY,
      id,
    };
    expectDeepEqual(actions.unmarkDirty(id), expectedAction);
  });
});

describe('action - `_markDone`', () => {
  it('should create an action to mark a task as done', () => {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.MARK_DONE,
      id,
    };
    expectDeepEqual(actions._markDone(id), expectedAction);
  });
});

describe('action - `_unmarkDone`', () => {
  it('should create an action to mark a task as undone', () => {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.UNMARK_DONE,
      id,
    };
    expectDeepEqual(actions._unmarkDone(id), expectedAction);
  });
});

describe('action - `_createMilestone`', () => {
  it('should create an action to create a new milestone', () => {
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

describe('action - `_deleteMilestone`', () => {
  it('should create an action to delete a milestone by id', () => {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.DELETE_MILESTONE,
      id,
    };
    expectDeepEqual(actions._deleteMilestone(id), expectedAction);
  });
});


describe('action - `_editMilestone`', () => {
  it('should create an action to edit a milestone by id', () => {
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

describe('action - `_createProject`', () => {
  it('should create an action to create a new project', () => {
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

describe('action - `_deleteProject`', () => {
  it('should create an action to delete a project by id', () => {
    const id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.DELETE_PROJECT,
      id,
    };
    expectDeepEqual(actions._deleteProject(id), expectedAction);
  });
});

describe('action - `replaceProjectId`', () => {
  it('should create an action to replace project id', () => {
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

describe('action - `_switchToProject`', () => {
  it('should create an action to switch to another project', () => {
    const project_id = 'sadkfjl213skafj134';
    const expectedAction = {
      type: types.SWITCH_TO_PROJECT,
      project_id,
    };
    expectDeepEqual(actions._switchToProject(project_id), expectedAction);
  });
});


describe('action - `projectAlert`', () => {
  it('should create an action to alert on project', () => {
    const alert = 'INVITED_TO_PROJECT';
    const expectedAction = {
      type: types.PROJECT_INVITATION_ALERT,
      alert,
    };
    expectDeepEqual(actions.projectAlert(alert), expectedAction);
  });
});

describe('action - `_updateProject`', () => {
  it('should create an action to switch to another project', () => {
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

describe('action - `joinProject`', () => {
  it('should create an action to let user join a project', () => {
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

describe('action - `initSearchResults`', () => {
  it('should create an action to init search results', () => {
    const results = [];
    const expectedAction = {
      type: types.INIT_RESULTS,
      results,
    };
    expectDeepEqual(actions.initSearchResults(results), expectedAction);
  });
});

describe('action - `addSearchResults`', () => {
  it('should create an action to add search results', () => {
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
describe('action - `queryProcessing`', () => {
  it('should create an action to show query in process', () => {
    const expectedAction = {
      type: types.QUERY_PROCESSING,
    };
    expectDeepEqual(actions.queryProcessing(), expectedAction);
  });
});

describe('action - `queryDone`', () => {
  it('should create an action to show query done', () => {
    const expectedAction = {
      type: types.QUERY_DONE,
    };
    expectDeepEqual(actions.queryDone(), expectedAction);
  });
});

describe('action - `initSnackbar`', () => {
  it('should create an action to init snack bar', () => {
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

describe('action - `initApp`', () => {
  it('should create an action to init app', () => {
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

describe('action - `initMilestones`', () => {
  it('should create an action to init milestones', () => {
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
describe('action - `initNotifications`', () => {
  it('should create an action to init notifications', () => {
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

describe('action - `initProjects`', () => {
  it('should create an action to init projects', () => {
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
describe('action - `initTasks`', () => {
  it('should create an action to init tasks', () => {
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
describe('action - `initUsers`', () => {
  it('should create an action to init users', () => {
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

describe('action - `initFiles`', () => {
  it('should create an action to init files', () => {
    const files = [];
    const expectedAction = {
      type: types.INIT_FILES,
      files,
    };
    expectDeepEqual(actions.initFiles(files), expectedAction);
  });
});

describe('action - `initMessages`', () => {
  it('should create an action to init messages', () => {
    const messages = [];
    const expectedAction = {
      type: types.INIT_MESSAGES,
      messages,
    };
    expectDeepEqual(actions.initMessages(messages), expectedAction);
  });
});

describe('action - `_initGithubRepos`', () => {
  it('should create an action to init github repos', () => {
    const repos = [];
    const expectedAction = {
      type: types.INIT_GITHUB_REPOS,
      repos,
    };
    expectDeepEqual(actions._initGithubRepos(repos), expectedAction);
  });
});

describe('action - `addNewsfeedEvents`', () => {
  it('should create an action to add newsfeed events', () => {
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

describe('action - `loggedOutGoogle`', () => {
  it('should create an action to log out of google', () => {
    const expectedAction = {
      type: types.LOGGED_OUT_GOOGLE,
    };
    expectDeepEqual(actions.loggedOutGoogle(), expectedAction);
  });
});

describe('action - `loggedIntoGoogle`', () => {
  it('should create an action to log out of google', () => {
    const expectedAction = {
      type: types.LOGGED_INTO_GOOGLE,
    };
    expectDeepEqual(actions.loggedIntoGoogle(), expectedAction);
  });
});

describe('action - `insertFile`', () => {
  it('should create an action to insert a single file', () => {
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

describe('action - `addFiles`', () => {
  it('should create an action to add multiple files', () => {
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

describe('action - `deleteFile`', () => {
  it('should create an action to delete file', () => {
    const id = '0B6AfgueBZ9TMU29UTFlSVjVJdEk';
    const expectedAction = {
      type: types.DELETE_FILE,
      id,
    };
    expectDeepEqual(actions.deleteFile(id), expectedAction);
  });
});

describe('action - `updateFile`', () => {
  it('should create an action update a file', () => {
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

describe('action - `addDirectory`', () => {
  it('should create an action to add a directory', () => {
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

describe('action - `goToDirectory`', () => {
  it('should create an action to go to directory', () => {
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

describe('action - `_setDirectoryAsRoot`', () => {
  it('should create an action to set folder as directory root', () => {
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

describe('action - `_setDefaultGithubRepo`', () => {
  it('should create an action to set default github repo', () => {
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

describe('action - `addMessage`', () => {
  it('should create an action to add a message', () => {
    const message = 'message';
    const expectedAction = {
      type: types.ADD_MESSAGE,
      message,
    };
    expectDeepEqual(actions.addMessage(message), expectedAction);
  });
});

describe('action - `userOnline`', () => {
  it('should create an action to notfiy user is online', () => {
    const id = 'id';
    const expectedAction = {
      type: types.USER_ONLINE,
      id,
    };
    expectDeepEqual(actions.userOnline(id), expectedAction);
  });
});

describe('action - `userOffline`', () => {
  it('should create an action to notfiy user is offline', () => {
    const id = 'id';
    const expectedAction = {
      type: types.USER_OFFLINE,
      id,
    };
    expectDeepEqual(actions.userOffline(id), expectedAction);
  });
});


describe('action - `addUsers`', () => {
  it('should create an action to add multiple users', () => {
    const users = [];
    const expectedAction = {
      type: types.ADD_USERS,
      users,
    };
    expectDeepEqual(actions.addUsers(users), expectedAction);
  });
});

describe('action - `userEditing`', () => {
  it('should create an action to notfiy user is editing', () => {
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

describe('action - `userStopEditing`', () => {
  it('should create an action to notfiy user stops editing', () => {
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

describe('action - `newNotification`', () => {
  it('should create an action to notfiy user stops editing', () => {
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

describe('action - `_deleteNotification`', () => {
  it('should create an action to notfiy user stops editing', () => {
    const id = 'V1iMfOJFf';
    const expectedAction = {
      type: types.DELETE_NOTIFICATION,
      id,
    };
    expectDeepEqual(actions._deleteNotification(id), expectedAction);
  });
});

describe('thunk action - `addUser`', () => {
  it('should create an action to notfiy user stops editing', () => {
    const id = 'V1iMfOJFf';
    const expectedAction = {
      type: types.DELETE_NOTIFICATION,
      id,
    };
    expectDeepEqual(actions._deleteNotification(id), expectedAction);
  });
});
/*

*/
