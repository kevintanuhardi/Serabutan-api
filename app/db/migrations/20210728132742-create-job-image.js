module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job_image', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jobId: {
        type: Sequelize.INTEGER,
        field: 'job_id',
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        field: 'image_url',
        allowNull: false,
      },
      sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('job_image');
  },
};
