/* global Helpers */

const {
  jobApplicationStatusEnum,
} = require('../../helpers/enum');

module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define('JobApplication', {
    employeeId: {
      field: 'employee_id',
      type: DataTypes.INTEGER,
    },
    jobId: {
      field: 'job_id',
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: jobApplicationStatusEnum,
      validate: {
        isIn: {
          args: [jobApplicationStatusEnum],
          msg: `Job application status must be between ${jobApplicationStatusEnum.join(
            ', ',
          )}`,
        },
      },
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'job_applications',
  });
  JobApplication.associate = (models) => {
    JobApplication.belongsTo(models.User, { sourceKey: 'employeeId', foreignKey: 'id', as: 'employee' });
  };
  return JobApplication;
};
