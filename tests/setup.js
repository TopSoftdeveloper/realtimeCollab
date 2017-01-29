/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import { sequelize } from '../server/data/models/modelManager';

global.chai = require('chai');
global.sinon = require('sinon');
global.expect = require('chai').expect;

global.chai.should();

beforeEach(() => {
  // TODO: Consider wrapping all tests in a transaction for more performant teardowns.
  // Recreate tables before each test.
  sequelize.sync({ force: true });
});
