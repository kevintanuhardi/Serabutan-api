const {
  jobStatusEnum,
  jobUrgencyEnum,
} = require('../../helpers/enum');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      job_poster_id: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      urgency: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: jobUrgencyEnum,
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: jobStatusEnum,
      },
      desc: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
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
  down: async (queryInterface) => {
    await queryInterface.dropTable('job');
  },
};
