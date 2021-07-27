/* global Helpers */

module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define('Province', {
    name: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'province',
  });
  Province.associate = (models) => {
  };
  return Province;
};
