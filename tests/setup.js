/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { sequelize } from '../server/data/models/modelManager';

global.chai = require('chai');
global.sinon = require('sinon');
global.expect = require('chai').expect;

global.chai.should();

beforeEach((done) => {
  // TODO: Consider wrapping all tests in a transaction for more performant teardowns.
  // Recreate tables before each test.
  sequelize
    .query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })
    .then(() => sequelize.sync({ force: true }))
    .then(() => sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true }))
    .then(() => {
      done();
    });
});
