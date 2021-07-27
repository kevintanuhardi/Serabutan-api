/* global Helpers */

const {
  jobStatusEnum,
  jobUrgencyEnum,
} = require('../../helpers/enum');

module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    jobPosterId: {
      field: 'job_poster_id',
      type: DataTypes.INTEGER,
    },
    latitude: {
      type: DataTypes.DECIMAL,
    },
    longitude: {
      type: DataTypes.DECIMAL,
    },
    urgency: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: jobUrgencyEnum,
      validate: {
        isIn: {
          args: [jobUrgencyEnum],
          msg: `Urgency must be betweeen ${jobUrgencyEnum.join(
            ', ',
          )}`,
        },
      },
    },
    title: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: jobStatusEnum,
      validate: {
        isIn: {
          args: [jobStatusEnum],
          msg: `Status must be betweeen ${jobStatusEnum.join(
            ', ',
          )}`,
        },
      },
    },
    desc: {
      type: DataTypes.STRING,
      field: 'desc',
    },
    price: {
      type: DataTypes.INTEGER,
      field: 'price',
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'job',
  });
  Job.associate = (models) => {
  };
  return Job;
};
