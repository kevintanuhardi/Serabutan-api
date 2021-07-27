/* global Helpers */

module.exports = (sequelize, DataTypes) => {
  const EmployerReview = sequelize.define('EmployerReview', {
    jobId: {
      type: DataTypes.INTEGER,
      field: 'job_id',
    },
    employeeId: {
      type: DataTypes.INTEGER,
      field: 'employee_id',
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
    tableName: 'employer_review',
  });
  EmployerReview.associate = (models) => {
    EmployerReview.hasOne(models.Employee, { foreignKey: 'userId', sourceKey: 'id', as: 'employee' });
  };
  return EmployerReview;
};
