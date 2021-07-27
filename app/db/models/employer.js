/* global Helpers */

module.exports = (sequelize, DataTypes) => {
  const Employer = sequelize.define('Employer', {
    userId: {
      field: 'user_id',
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
    tableName: 'employer',
  });
  Employer.associate = (models) => {
    Employer.hasOne(models.Employee, { foreignKey: 'userId', sourceKey: 'id', as: 'employee' });
  };
  return Employer;
};
