/* global Helpers */

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    skill: {
      type: DataTypes.STRING,
    },
    shortDesc: {
      field: 'short_desc',
      type: DataTypes.STRING,
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
    tableName: 'employee',
  });
  Employee.associate = (models) => {
  };
  return Employee;
};
