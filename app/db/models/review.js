/* global Helpers */

const {
  reviewRoleEnum,
} = require('../../helpers/enum');

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    jobId: {
      type: DataTypes.INTEGER,
      field: 'job_id',
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
    },
    rate: {
      type: DataTypes.INTEGER,
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: reviewRoleEnum,
      validate: {
        isIn: {
          args: [reviewRoleEnum],
          msg: `review role must be between ${reviewRoleEnum.join(
            ', ',
          )}`,
        },
      },
    },
    desc: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'review',
  });
  Review.associate = (models) => {
    // Review.hasOne(models.Employee, { foreignKey: 'userId', sourceKey: 'id', as: 'employee' });
  };
  return Review;
};
