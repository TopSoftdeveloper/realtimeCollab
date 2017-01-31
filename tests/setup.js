/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { sequelize } from '../server/data/models/modelManager';

global.chai = require('chai');
global.sinon = require('sinon');
global.expect = require('chai').expect;

global.chai.should();

beforeEach((done) => {
  // Recreate tables before each test.
  // Manually truncate tables instead of using .sync({ force: true })
  // because Sequelize doesn't infer foreign key constraints properly
  // and will try to drop tables in the wrong order, throwing errors.
  sequelize.transaction((t) => {
    const options = { raw: true, transaction: t };
    return sequelize
      .query('SET FOREIGN_KEY_CHECKS = 0', options)
      .then(() => sequelize.query('truncate table users', options))
      .then(() => sequelize.query('truncate table projects', options))
      .then(() => sequelize.query('truncate table user_projects', options))
      .then(() => sequelize.query('truncate table milestones', options))
      .then(() => sequelize.query('truncate table newsfeeds', options))
      .then(() => sequelize.query('truncate table tasks', options))
      .then(() => sequelize.query('truncate table notifications', options))
      .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options));
  }).then(() => {
    done();
  }).catch(() => {
    done();
  });
});
