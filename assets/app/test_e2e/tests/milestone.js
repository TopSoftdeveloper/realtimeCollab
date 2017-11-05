const projectName = Math.random().toString(36).substr(2, 5);
const milestoneName = Math.random().toString(36).substr(2, 5);
const milestoneDate = 'November 30, 2019';
const newMilestoneName = Math.random().toString(36).substr(2, 5);

/* eslint-disable no-unused-expressions */
module.exports = {
  tags: ['project'],
  beforeEach: (client) => {
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.login();
  },
  'Add milestone': (client) => {
    const homepage = client.page.app();
    homepage.addProject(projectName);
    homepage.click(`#project-${projectName}`).api.pause(500);
    homepage.addMilestone(milestoneName, milestoneDate);

    // Snackbar message is displayed
    homepage.waitForElementVisible('@systemSnackbar', 2000);
    homepage.expect.element('@systemSnackbar').text.to.equal('Milestone created');
    client.end();
  },
  'Edit milestone': (client) => {
    const homepage = client.page.app();
    homepage.waitForElementPresent(`#project-${projectName}`, 5000);
    homepage.click(`#project-${projectName}`).api.pause(500);
    homepage.waitForElementVisible(`#milestone-${milestoneName} .milestone-title > span`, 5000);
    homepage.moveToElement(`#milestone-${milestoneName} .milestone-title > span`, 3, 3);
    homepage.api.pause(100);
    homepage.click(`#milestone-${milestoneName} .milestone-actions .edit-task`);
    homepage.waitForElementVisible('@addMilestoneNameInput', 2000);
    homepage.setValue('@addMilestoneNameInput', newMilestoneName);
    homepage.click('@addMilestoneSubmitBtn');

    // Snackbar displays "Milestone updated"
    homepage.waitForElementVisible('@systemSnackbar', 2000);
    homepage.expect.element('@systemSnackbar').text.to.equal('Milestone updated');
    client.end();
  },
};
