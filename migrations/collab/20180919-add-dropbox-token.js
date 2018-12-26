module.exports = {
  up: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
    queryInterface.addColumn(
      'users',
      'dropbox_refresh_token',
      Sequelize.BOOLEAN
    );
  },

  down: (queryInterface, Sequelize) => {
    // logic for reverting the changes
    queryInterface.removeColumn(
      'users',
      'dropbox_refresh_token'
    );
  }
}