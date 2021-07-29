/* global Helpers */

const {
  otpTypeEnum,
} = require('../../helpers/enum');

module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define('Otp', {
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      field: 'user_id',
      type: DataTypes.NUMBER,
    },
    phoneNumber: {
      field: 'phone_number',
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: otpTypeEnum,
      validate: {
        isIn: {
          args: [otpTypeEnum],
          msg: `OTP type must be between ${otpTypeEnum.join(
            ', ',
          )}`,
        },
      },
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'otp',
  });
  Otp.associate = (models) => {
  };
  return Otp;
};
