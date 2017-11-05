const projectName = Math.random().toString(36).substr(2, 5);
const milestoneName = Math.random().toString(36).substr(2, 5);
const milestoneDate = 'November 30, 2019';
const taskName = Math.random().toString(36).substr(2, 5);

/* eslint-disable no-unused-expressions */
module.exports = {
  tags: ['project'],
  beforeEach: (client) => {
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.login();
  },
  'Add task': (client) => {
    const homepage = client.page.app();
    homepage.addProject(projectName);
    homepage.click(`#project-${projectName}`).api.pause(500);
    homepage.addMilestone(milestoneName, milestoneDate);

    homepage.waitForElementVisible(`#milestone-${milestoneName}`, 2000);
    homepage.click(`#milestone-${milestoneName} .add-task-btn`);
    homepage.waitForElementVisible('@addTaskNameInput', 2000);
    homepage.setValue('@addTaskNameInput', taskName);
    homepage.click('@addTaskSubmitBtn').api.pause(500);

    // Snackbar message is displayed
    homepage.waitForElementVisible('@systemSnackbar', 2000);
    homepage.expect.element('@systemSnackbar').text.to.equal('Task added');
    client.end();
  },
  'Complete task': (client) => {
    const homepage = client.page.app();
    homepage.waitForElementPresent(`#project-${projectName}`, 5000);
    homepage.click(`#project-${projectName}`).api.pause(500);
    homepage.waitForElementVisible(`#milestone-${milestoneName}`, 2000);

    homepage.waitForElementVisible(`#milestone-${milestoneName} .task-row .task-checkbox`, 2000);
    homepage.click(`#milestone-${milestoneName} .task-row .task-checkbox`);
    homepage.expect.element(`#milestone-${milestoneName} .task-row .task-checkbox`)
      .to.not.be.present;
    client.end();
  },
};
