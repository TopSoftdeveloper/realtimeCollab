/* global sinon, expect, beforeEach, afterEach, it, describe, context */
import events from 'events';
import request from 'request';
import server from '../../server/server';

describe('Webhook', function() {
  beforeEach(function(done) {
    this.sandbox = sinon.sandbox.create();
    done();
  });

  afterEach(function(done) {
    this.sandbox.restore();
    done();
  });

  context('github webhook setup', function() {
    beforeEach(function(done) {
      this.payload = {
        owner: 'owner1',
        name: 'name1',
        token: 'token1',
      };
      done();
    });


    it('should create github webhook', function(done) {
      // Mock request.post().form().on('response', () => {})
      // Kind of a hacky approach. Consider using something like nock.
      const requestPostStub = this.sandbox.stub(request, 'post');
      const formMock = this.sandbox.mock();
      const emitter = new events.EventEmitter();
      setTimeout(() => emitter.emit('response'), 200);
      formMock.returns(emitter)
        .once();
      requestPostStub.returns({ form: formMock });

      server.select('api').inject({
        method: 'POST',
        url: '/webhook/github/setup',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        formMock.verify();
        const calledArgs = JSON.parse(formMock.args[0][0]);
        expect(calledArgs.events).to.deep.equal(['create', 'push']);
        expect(calledArgs.name).to.equal('web');
        expect(calledArgs.active).to.equal(true);
        done();
      });
    });
  });
});
