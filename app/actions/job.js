/* eslint-disable no-mixed-operators */
const { QueryTypes } = require('sequelize');

const { sequelize } = require('../db/models');

const R = 6371e3; // earth's mean radius in metres
const { cos } = Math;
const π = Math.PI;

module.exports = {
  getNearbyJob: async ({ lat, lng, radius }) => {
    const sql = `
    Select *,
    st_distance_sphere(ST_GeomFromText('POINT(:lng :lat)'), coordinate) as dist 
    From job
    Where st_y(coordinate) Between :minLat And :maxLat
      And st_x(coordinate) Between :minLon And :maxLon`;
    const replacements = {
      minLat: Number(lat) - radius / R * 180 / π,
      maxLat: Number(lat) + radius / R * 180 / π,
      minLon: Number(lng) - radius / R * 180 / π / cos(Number(lat) * π / 180),
      maxLon: Number(lng) + radius / R * 180 / π / cos(Number(lat) * π / 180),
      lat,
      lng,
    };
    return sequelize.query(sql, { replacements, type: QueryTypes.SELECT });
  },
};
