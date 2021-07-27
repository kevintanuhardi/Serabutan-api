const {
  jobApplicationStatusEnum,
} = require('../../helpers/enum');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job_applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employee_id: {
        type: Sequelize.INTEGER,
      },
      job_id: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: jobApplicationStatusEnum,
        validate: {
          isIn: {
            args: [jobApplicationStatusEnum],
            msg: `Jenis Kelamin harus di antara ${jobApplicationStatusEnum.join(
              ', ',
            )}`,
          },
        },
      },
      cover_letter: {
        type: Sequelize.STRING,
      },
      asking_price: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('job_applications');
  },
};
