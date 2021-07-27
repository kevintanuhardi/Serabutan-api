/* global Helpers */

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    title: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'tag',
  });
  Tag.associate = (models) => {
  };
  return Tag;
};
