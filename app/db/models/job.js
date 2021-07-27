/* global Helpers */

const {
  jobStatusEnum,
} = require('../../helpers/enum');

module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    jobPosterId: {
      field: 'job_poster_id',
      type: DataTypes.INTEGER,
    },
    categoryId: {
      field: 'category_id',
      type: DataTypes.INTEGER,
    },
    locationId: {
      field: 'location_id',
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: jobStatusEnum,
      validate: {
        isIn: {
          args: [jobStatusEnum],
          msg: `Jenis Kelamin harus di antara ${jobStatusEnum.join(
            ', ',
          )}`,
        },
      },
    },
    jobDesc: {
      type: DataTypes.STRING,
      field: 'job_desc',
    },
    startDate: {
      type: DataTypes.DATE,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      field: 'end_date',
    },
    minPrice: {
      type: DataTypes.INTEGER,
      field: 'min_price',
    },
    maxPrice: {
      type: DataTypes.INTEGER,
      field: 'max_price',
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
