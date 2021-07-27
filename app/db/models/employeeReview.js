/* global Helpers */

module.exports = (sequelize, DataTypes) => {
  const EmployeeReview = sequelize.define('EmployeeReview', {
    applicationId: {
      type: DataTypes.INTEGER,
      field: 'job_id',
    },
    employerId: {
      type: DataTypes.INTEGER,
      field: 'employer_id',
    },
    rate: {
      type: DataTypes.INTEGER,
    },
    desc: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'employee_review',
  });
  EmployeeReview.associate = (models) => {
    // EmployeeReview.hasOne(models.Employee, { foreignKey: 'userId', sourceKey: 'id', as: 'employee' });
  };
  return EmployeeReview;
};
