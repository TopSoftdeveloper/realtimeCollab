/* eslint-disable no-unused-expressions */
module.exports = {
  tags: ['auth'],
  Login: (client) => {
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.expect.element('body').to.be.present;
    loginPage.expect.element('#task-panel').to.not.be.present;
    loginPage.expect.element('@loginBtn').to.be.visible;
    loginPage.login();
    client.end();
  },
  Logout: (client) => {
    // login
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.expect.element('body').to.be.present;
    loginPage.expect.element('#task-panel').to.not.be.present;
    loginPage.expect.element('@loginBtn').to.be.visible;
    // loginPage.click('@loginBtn').api.pause(1000);
    // loginPage.expect.element('.login-btn-text').text.to.contain('Logging in...');
    loginPage.login();

    // click on logout button
    client.expect.element('.headerIconMenu').to.be.visible;
    client.click('.headerIconMenu')
    .pause(500)
    .expect.element('#logoutBtn').to.be.visible;
    client.click('#logoutBtn').pause(500);

    // user is logged out, login button is visible again
    client.expect.element('#task-panel').to.not.be.present;
    loginPage.expect.element('@loginBtn').to.be.visible;
    client.end();
  },
};
