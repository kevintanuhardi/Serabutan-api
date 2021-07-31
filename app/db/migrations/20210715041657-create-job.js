const {
  jobStatusEnum,
  jobUrgencyEnum,
  genderEnum,
  ageRangeEnum,
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
      coordinate: {
        type: Sequelize.GEOMETRY,
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
      gender_preference: {
        type: Sequelize.ENUM,
        values: genderEnum,
      },
      age_preference: {
        type: Sequelize.ENUM,
        values: ageRangeEnum,
      },
      desc: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('job');
  },
};
