'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'tags', // table name
        'discord_emoji', // new field name
        {
          type: Sequelize.STRING
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('tags', 'discord_emoji'),
    ]);
  }
};
