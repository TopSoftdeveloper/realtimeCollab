const projectName = Math.random().toString(36).substr(2, 5);
const newProjectName = Math.random().toString(36).substr(2, 5);

/* eslint-disable no-unused-expressions */
module.exports = {
  tags: ['project'],
  beforeEach: (client) => {
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.login();
  },
  'Add project': (client) => {
    const homepage = client.page.app();
    homepage.addProject(projectName);
    client.end();
  },
  'View project': (client) => {
    const homepage = client.page.app();
    const sidebarProjectBtnSelector = `#project-${projectName}`;
    homepage.waitForElementPresent(sidebarProjectBtnSelector, 2000);
    homepage.click(sidebarProjectBtnSelector).api.pause(1000);
    homepage.expect.element('@milestonesTab').to.be.visible;
    homepage.expect.element('@emptyMilestonesMessage').to.be.visible;
    client.end();
  },
  'Rename project': (client) => {
    const homepage = client.page.app();
    const sidebarProjectBtnSelector = `#project-${projectName}`;
    homepage.waitForElementPresent(sidebarProjectBtnSelector, 2000);
    homepage.click(sidebarProjectBtnSelector).api.pause(1000);
    homepage.click('@settingsTab').api.pause(1000);
    homepage.expect.element('@renameProjectInput').to.be.visible;
    homepage.setValue('@renameProjectInput', newProjectName);
    homepage.click('@renameProjectBtn').api.pause(1000);
    homepage.expect.element(`#project-${newProjectName}`).to.be.present;
    client.end();
  },
};
