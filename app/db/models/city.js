/* global Helpers */

module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    name: {
      type: DataTypes.STRING,
    },
    provinceId: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'city',
  });
  City.associate = (models) => {
  };
  return City;
};
