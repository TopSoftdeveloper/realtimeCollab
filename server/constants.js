module.exports = {
  GITHUB_ENDPOINT: 'https://api.github.com',
  NEWSFEED_MODEL_NAME: 'newsfeed',
  NOTIFICATION_MODEL_NAME: 'notifications',
  USER_PROJECT: 'user_project',
  PROJECT_MODEL_NAME: 'projects',
  TASK_MODEL_NAME: 'tasks',
  USER_MODEL_NAME: 'users',
  MILESTONE_MODEL_NAME: 'milestones',
  MESSAGE_MODEL_NAME: 'messages',
  DUPLICATE_PRIMARY_KEY: 'PRIMARY must be unique',
  PROJECT_NOT_EXIST: 'Project id {} does not exist',
  MILESTONE_NOT_EXIST: 'Milestone id {} does not exist',
  TASK_NOT_EXIST: 'Task id {} does not exist',
  MESSAGE_NOT_EXIST: 'Message id {} does not exist',
  EMAIL_ALREADY_EXISTS: 'Email {} already exists',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_PRESENT: 'User already exists',
  AUTHENTICATION_ERROR: 'Invalid email or password',
  STATUS_OK: 'OK',
  STATUS_FAIL: 'fail',
  ROLE_CREATOR: 'creator',
  ROLE_BASIC: 'basic',
  ROLE_PENDING: 'pending',
  FORBIDDEN: 'The token given does not have access to this resource',
  NO_GITHUB_LOGIN: 'NO_GITHUB_LOGIN',
  NO_GITHUB_NUMBER: 'NO_GITHUB_NUMBER',
  GITHUB: 'GITHUB',
  GOOGLE_DRIVE: 'GOOGLE_DRIVE',
  COLLAB_TASK: 'COLLAB_TASK',
  COLLAB_MILESTONE: 'COLLAB_MILESTONE',

  systemMessageTypes: {
    CREATE_TASK: 'CREATE_TASK',
    MARK_TASK_AS_DONE: 'MARK_TASK_AS_DONE',
    REOPEN_TASK: 'REOPEN_TASK',
    DELETE_TASK: 'DELETE_TASK',
    EDIT_TASK_CONTENT: 'EDIT_TASK_CONTENT',
    REASSIGN_TASK_TO_USER: 'REASSIGN_TASK_TO_USER',
    REASSIGN_TASK_TO_MILESTONE: 'REASSIGN_TASK_TO_MILESTONE',
    CREATE_MILESTONE: 'CREATE_MILESTONE',
    EDIT_MILESTONE_CONTENT: 'EDIT_MILESTONE_CONTENT',
    EDIT_MILESTONE_DEADLINE: 'EDIT_MILESTONE_DEADLINE',
    DELETE_MILESTONE: 'DELETE_MILESTONE',
  },
};
