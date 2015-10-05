var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var supertest = require('supertest');
var api = supertest('http://localhost:4000');
var constants = require('../server/constants');
var storage = require('../server/data/storage');
var format = require('string-format');
var Promise = require("bluebird");
var Jwt = require('jsonwebtoken');
var config = require('config');

var secret_key = config.get('authentication.privateKey');
var token_expiry = config.get('authentication.tokenExpirySeconds');

var TEST_EMAIL = 'test@test.com';
var TEST_PASSWORD = 'abcdefg';
var task_id = null;
var milestone_id = null;

describe('Authentication', function() {
    var user_id = null;
    var BUFFER_SECONDS = 3;

    before(function(done) {
       // Prepare database
        storage.removeUser(TEST_EMAIL).then(function() {
            done();
        });
    });

    it('should return token, email and user id upon account creation', function(done) {
        var created_time = Math.floor((new Date()).getTime() / 1000);

        api.post('/create_account')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD
                })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                user_id = res.body.user_id;
                expect(res.body.email).to.equal(TEST_EMAIL);
                expect(user_id).to.have.length.above(6);
                Jwt.verify(res.body.token, secret_key, function(err, decoded) {
                    console.log(err);
                    expect(err).to.equal(null);
                    expect(decoded.email).to.equal(TEST_EMAIL);
                    expect(decoded.user_id).to.equal(user_id);
                    expect(decoded.expiresIn).to.equal(token_expiry);
                    expect(decoded.iat).to.be.within(created_time, created_time + BUFFER_SECONDS);
                    done();
                });
            });
    });

    it('should not create multiple accounts with one email', function(done) {
        api.post('/create_account')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            })
            .expect('Content-Type', /json/)
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal(format(constants.EMAIL_ALREADY_EXISTS, TEST_EMAIL));
                done();
            });
    });

    it('should return token, email and user id upon login', function(done) {
        var created_time = Math.floor((new Date()).getTime() / 1000);

        api.post('/login')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                expect(res.body.email).to.equal(TEST_EMAIL);
                expect(res.body.user_id).to.equal(user_id);
                Jwt.verify(res.body.token, secret_key, function(err, decoded) {
                    expect(err).to.equal(null);
                    expect(decoded.email).to.equal(TEST_EMAIL);
                    expect(decoded.user_id).to.equal(user_id);
                    expect(decoded.expiresIn).to.equal(token_expiry);
                    expect(decoded.iat).to.be.within(created_time, created_time + BUFFER_SECONDS);
                    done();
                });
            });
    });

    it('should indicate access forbidden when token timeout', function(done) {
        var token_data = {
            email: 'myemail@u.nus.edu',
            user_id: 'abc123',
            expiresIn: 1
        };

        var token_1_sec_expiry = Jwt.sign(token_data, secret_key);

        setTimeout(function() {
            api.get('/task')
                .set('Accept', 'application/json')
                .set('Authorization', 'bearer ' + token_1_sec_expiry)
                .expect('Content-Type', /json/)
                .expect(401, done);
        }, 1100);
    });

    it('should indicate access forbidden when given token signed with wrong key', function(done) {
        var token_data = {
            email: 'myemail@u.nus.edu',
            user_id: 'abc123',
            expiresIn: 100
        };

        var fake_token = Jwt.sign(token_data, 'someWrongKey');
        api.get('/task')
            .set('Accept', 'application/json')
            .set('Authorization', 'bearer ' + fake_token)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
});

describe('Task', function() {
    var token = null;

    before(function(done) {
        //Prepare database
        storage.createMilestone({content: 'my great milestone'}).then(function(id) {
            milestone_id = id;
            done();
        }) ;

        // Get auth token
        var token_data = {
            email: 'myemail@u.nus.edu',
            user_id: 'abc123',
            expiresIn: 200
        };

        token = Jwt.sign(token_data, secret_key);
    });

    after(function(done) {
        //Clean up database
        storage.deleteMilestone(milestone_id).then(function() {
            storage.deleteTask(task_id).then(function() {
                done();
            });
        });
    });

    it('should return task object with correct defaults', function(done) {
        var content = 'submit report';
        api.post('/create_task')
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('Authorization', 'bearer ' + token)
            .send({
                content: content
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                task_id = res.body.id;
                expect(res.body.content).to.equal(content);
                expect(res.body.deadline).to.equal(null);
                expect(res.body.is_time_specified).to.equal(false);
                expect(res.body.milestone_id).to.equal(null);
                expect(task_id).to.have.length.above(6);
                storage.deleteTask(task_id).then(function() {
                    done();
                });
            });
    });

    it('should return task object with correct properties set', function(done) {
        var content = 'submit report';
        var deadline = '2015-10-04T18:13:09+00:00';
        api.post('/create_task')
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('Authorization', 'bearer ' + token)
            .send({
                content: content,
                deadline: deadline,
                is_time_specified: true,
                milestone_id: milestone_id
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                task_id = res.body.id;
                expect(res.body.content).to.equal(content);
                expect(res.body.deadline).to.equal(deadline);
                expect(res.body.is_time_specified).to.equal(true);
                expect(res.body.milestone_id).to.equal(milestone_id);
                expect(task_id).to.have.length.above(6);
                done();
            });
    });

    it('should not create a task using non-existent milestone id', function(done) {
        var content = 'submit report';
        var non_existent_id = 'blah??';
        api.post('/create_task')
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('Authorization', 'bearer ' + token)
            .send({
                content: content,
                milestone_id: non_existent_id
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal(format(constants.MILESTONE_NOT_EXIST, non_existent_id));
                done();
            });
    });

    it('should return status OK upon successful marking complete', function(done) {
        storage.createTask({content: 'sample'}).then(function(task_id) {
            api.post('/mark_completed')
                .set('Accept', 'application/x-www-form-urlencoded')
                .set('Authorization', 'bearer ' + token)
                .send({
                    task_id: task_id
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.status).to.equal(constants.STATUS_OK);
                    storage.deleteTask(task_id).then(function() {
                        done();
                    });
                });
        });
    });

    it('should return status OK upon successful deletion', function(done) {
        storage.createTask({content: 'hello world'}).then(function(id) {
            api.delete('/delete_task')
                .set('Accept', 'application/x-www-form-urlencoded')
                .set('Authorization', 'bearer ' + token)
                .send({
                    task_id: id
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.status).to.equal(constants.STATUS_OK);
                    done();
                });
        });
    });

    it('should not mark a task which does not exist as completed', function(done) {
        var non_existent_id = 'blah??';
        api.post('/mark_completed')
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('Authorization', 'bearer ' + token)
            .send({
                task_id: non_existent_id
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.message).to.equal(format(constants.TASK_NOT_EXIST, non_existent_id));
                done();
            });
    });
});

describe('Milestone', function() {
    var token = null;
    before(function(done) {
        // Get auth token
        var token_data = {
            email: 'myemail@u.nus.edu',
            user_id: 'abc123',
            expiresIn: 200
        };

        token = Jwt.sign(token_data, secret_key);
        done();
    });

    after(function(done) {
        //Clean up database
        storage.deleteMilestone(milestone_id).then(function() {
            done();
        });
    });

    it('should return milestone object with correct defaults', function(done) {
        var content = 'Complete Marathon';
        api.post('/create_milestone')
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('Authorization', 'bearer ' + token)
            .send({
                content: content
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                milestone_id = res.body.id;
                expect(res.body.content).to.equal(content);
                expect(res.body.deadline).to.equal(null);
                expect(milestone_id).to.have.length.above(6);
                done();
            });
    });

    it('should return status OK upon successful deletion', function(done) {
        var content = 'some temp milestone';
        storage.createMilestone({content: content}).then(function(id) {
            api.delete('/delete_milestone')
                .set('Accept', 'application/x-www-form-urlencoded')
                .set('Authorization', 'bearer ' + token)
                .send({
                    milestone_id: id
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.status).to.equal(constants.STATUS_OK);
                    done();
                });
        });
    });
});