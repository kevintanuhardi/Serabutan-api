/* global Helpers */
const bcrypt = require('bcryptjs');

const {
  genderEnum,
} = require('../../helpers/enum');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    phoneNumber: {
      type: DataTypes.STRING,
      field: 'phone_number',
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_of_birth',
    },
    gender: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: genderEnum,
      validate: {
        isIn: {
          args: [genderEnum],
          msg: `Gender must be between ${genderEnum.join(
            ', ',
          )}`,
        },
      },
    },
    bioDesc: {
      type: DataTypes.STRING,
      field: 'bio_desc',
    },
    profileImage: {
      type: DataTypes.STRING,
      field: 'profile_image',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: 1,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      field: 'is_verified',
      defaultValue: 0,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'user',
  });
  User.associate = (models) => {
  };
  return User;
};
