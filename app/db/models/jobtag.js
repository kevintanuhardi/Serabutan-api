/* global Helpers */

module.exports = (sequelize, DataTypes) => {
  const JobTag = sequelize.define('JobTag', {
    jobId: {
      field: 'job_id',
      type: DataTypes.STRING,
    },
    tagId: {
      field: 'tag_id',
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'job_tag',
  });
  JobTag.associate = (models) => {
  };
  return JobTag;
};
