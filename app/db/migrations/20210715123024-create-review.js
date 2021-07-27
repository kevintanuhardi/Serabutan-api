const {
  reviewRoleEnum,
} = require('../../helpers/enum');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('review', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      job_id: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      rate: {
        type: Sequelize.INTEGER,
      },
      role: {
        type: Sequelize.ENUM,
        values: reviewRoleEnum,
      },
      desc: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('review');
  },
};
