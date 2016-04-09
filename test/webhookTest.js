var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var supertest = require('supertest');
var constants = require('../server/constants');
var storage = require('../server/data/storage');
var format = require('string-format');
var Jwt = require('jsonwebtoken');
var config = require('config');
var models = require('../server/data/models/modelManager');
var UserProject = models.UserProject;

var secret_key = config.get('authentication.privateKey');
var token_expiry = config.get('authentication.tokenExpirySeconds');
//
//describe('Webhook', function() {
//    var token = null;
//    var user_id = null;
//    const MOCK_EMAIL = 'hi@project';
//    var project_id = null;
//
//    before(function(done) {
//        storage.removeUser(MOCK_EMAIL).then(function() {
//            storage.createUser('salt', 'password', MOCK_EMAIL).then(function(user) {
//                user_id = user.id;
//                // Get auth token
//                var token_data = {
//                    email: 'hi@project',
//                    user_id: user_id,
//                    expiresIn: 200
//                };
//
//                token = Jwt.sign(token_data, secret_key);
//                done();
//            });
//        });
//    });
//
//    after(function(done) {
//        //Clean up database
//        storage.removeUser(MOCK_EMAIL).then(function() {
//            storage.removeProject(project_id).then(function() {
//                done();
//            });
//        });
//    });
//
//    it('should return project id and link user id with this project', function(done) {
//        var content = 'Collaboration Tool';
//        api.post('/projects')
//            .set('Accept', 'application/x-www-form-urlencoded')
//            .set('Authorization', 'bearer ' + token)
//            .send({
//                content: content
//            })
//            .expect('Content-Type', /json/)
//            .expect(200)
//            .end(function(err, res) {
//                expect(err).to.equal(null);
//                expect(res.body.project_id).to.have.length.above(6);
//                project_id = res.body.project_id;
//                UserProject.findAll({
//                    where: {
//                        user_id: user_id,
//                        project_id: res.body.project_id
//                    }
//                }).then(function(arr) {
//                    expect(arr.length).to.equal(1);
//                    expect(arr[0].dataValues.role).to.equal(constants.ROLE_CREATOR);
//                    done();
//                });
//            });
//    });
//});