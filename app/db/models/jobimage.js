/* global Helpers */


module.exports = (sequelize, DataTypes) => {
  const JobImage = sequelize.define('JobImage', {
    jobId: {
      type: DataTypes.NUMBER,
      field: 'job_id',
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      field: 'image_url',
      allowNull: false,
    },
    sequence: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'job_image',
  });
  JobImage.associate = (models) => {
  };
  return JobImage;
};
