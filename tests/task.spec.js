/* global sinon, expect, beforeEach, afterEach, it, describe */
import Sequelize from 'sequelize';
import task from '../server/controller/taskController';
import storage from '../server/data/storage';
// import templates from '../server/templates';
// import socket from '../server/controller/socket/handlers';
import constants from '../server/constants';
import server from '../server/server';
import models from '../server/data/models/modelManager';

describe('Task', function() {
  beforeEach(function(done) {
    let user = null;
    models.User
      .create({ id: 'user1' })
      .then((newUser) => {
        user = newUser;
        return models.Project.create({
          id: 'project1',
        });
      })
      .then((newProject) => user.addProject(newProject, { role: constants.ROLE_CREATOR }))
      .then(() => models.Milestone.create({
        id: 'milestone1',
        project_id: 'project1',
      }))
      .then(() => models.Task.create({
        id: 'task1',
        project_id: 'project1',
        milestone_id: 'milestone1',
      }))
      .then(() => {
        done();
      });
  });

  it('should get existing tasks', function(done) {
    storage.getTask('task1').then((task1) => {
      expect(task1.id).to.equal('task1');
      done();
    });
  });
});
