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
          msg: `Jenis Kelamin harus di antara ${jobApplicationStatusEnum.join(
            ', ',
          )}`,
        },
      },
    },
    coverLetter: {
      type: DataTypes.STRING,
      field: 'cover_letter',
    },
    askingPrice: {
      type: DataTypes.INTEGER,
      field: 'asking_price',
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'job_application',
  });
  JobApplication.associate = (models) => {
  };
  return JobApplication;
};
