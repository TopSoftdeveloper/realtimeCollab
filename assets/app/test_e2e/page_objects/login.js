var config = require('config');
var req = require('request')
var authController = require('../../../../server/controller/authController');

function login() {
  const CLIENT_ID = config.get('google.client_id');
  const CLIENT_SECRET = config.get('google.client_secret');
  const PRIVATE_KEY = config.get('authentication.privateKey');
  const USER_ID = config.get('integration_test_account.user_id');
  const EMAIL = config.get('integration_test_account.email');
  const DISPLAY_IMAGE = config.get('integration_test_account.display_image');

  const options = {
    url: 'https://www.googleapis.com/oauth2/v4/token',
    form: {
      refresh_token: config.get('integration_test_account.refresh_token'),
      client_secret: CLIENT_SECRET,
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
    },
  };
  let accessToken;
  let expiresIn;
  let jwtToken;
  this.api.perform(function(client, done) {
    req.post(options, (err, res, body) => {
      if (err) {
        console.error('Error refreshing tokens');
        console.error(err);
      }
      const parsedBody = JSON.parse(body);
      accessToken = parsedBody.access_token;
      expiresIn = (parsedBody.expires_in * 1000) + new Date().getTime();
      jwtToken = authController.get_token(PRIVATE_KEY, USER_ID, expiresIn);
      client
        .url('http://localhost:8080/')
        .execute(function(accessToken, expiresIn, jwtToken, userId, displayImage, email) {
          window.localStorage.setItem('google_token', accessToken);
          window.localStorage.setItem('expiry_date', expiresIn);
          window.localStorage.setItem('jwt', jwtToken);
          window.localStorage.setItem('user_id', userId);
          window.localStorage.setItem('display_name', 'NUSCollab TestAccount');
          window.localStorage.setItem('display_image', displayImage);
          window.localStorage.setItem('email', email);
          return true;
        }, [accessToken, expiresIn, jwtToken, USER_ID, DISPLAY_IMAGE, EMAIL], function(result) {
          this.assert.ok(result.value, 'Localstorage updated with access tokens.');
        })
        .execute(function() {
          return [
            window.localStorage.getItem('google_token'),
            window.localStorage.getItem('expiry_date'),
            window.localStorage.getItem('jwt'),
            window.localStorage.getItem('user_id'),
          ];
        }, [], function(result) {
          this.pause(1000);
          this.url('http://localhost:8080/app/dashboard');
          // this.refresh();
          this.waitForElementVisible('#task-panel', 10000);
          this.pause(1000);
          this.assert.visible('#task-panel', 'User is logged in');
          done();
        });
    });
  });
  return this;
}

const loginCommands = {
  login,
};

module.exports = {
  url: 'http://localhost:8080/',
  commands: [loginCommands],
  elements: {
    loginBtn: '.btn.btn-social.btn-google',
  },
};
