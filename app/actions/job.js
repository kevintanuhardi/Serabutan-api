/* eslint-disable no-mixed-operators */
const { QueryTypes } = require('sequelize');

const { sequelize } = require('../db/models');
const { dbJobToModelJob } = require('../DTO');

const R = 6371e3; // earth's mean radius in metres
const { cos } = Math;
const π = Math.PI;

module.exports = {
  getNearbyJob: async ({ lat, lng, radius }) => {
    const sql = `
    Select *,
    st_distance_sphere(ST_GeomFromText('POINT(:lng :lat)'), coordinate) as distance
    From job
    Where st_y(coordinate) Between :minLat And :maxLat
      And st_x(coordinate) Between :minLon And :maxLon
      And status = 'ACTIVE'`;
    const replacements = {
      minLat: Number(lat) - radius / R * 180 / π,
      maxLat: Number(lat) + radius / R * 180 / π,
      minLon: Number(lng) - radius / R * 180 / π / cos(Number(lat) * π / 180),
      maxLon: Number(lng) + radius / R * 180 / π / cos(Number(lat) * π / 180),
      lat,
      lng,
    };
    const queryResult = await sequelize.query(sql, { replacements, type: QueryTypes.SELECT });

    return queryResult.map((el) => dbJobToModelJob(el));
  },
  search: async ({
    where = {}, arrOrder, lat, lng, radius = 1000,
  }) => {
    let orderString = 'ORDER BY ';
    arrOrder.forEach((order) => {
      orderString += `${order[0]} ${order[1]}`;
    });
    let additionalWhere = '';
    Object.keys(where).forEach((el) => {
      if (el === 'title') {
        additionalWhere += ` And j.${el} Like "`;
        if (where[el].split(' ').length >= 2) {
          const wordArr = where[el].split(' ');
          wordArr.forEach((word) => {
            additionalWhere += `%${word}%`;
          });
        } else {
          additionalWhere += ` %${where[el]}%`;
        }
        additionalWhere += '"';
      } else if (el === 'gtePrice') {
        // additionalWhere += ` AND price >= %${where[el]}%`;
      } else if (el === 'ltePrice') {
        // additionalWhere += ` AND price <= %${where[el]}%`;
      } else {
        additionalWhere += ` AND ${el} = "${where[el]}"`;
      }
    });
    const sql = `
    Select *,
    st_distance_sphere(ST_GeomFromText('POINT(:lng :lat)'), coordinate) as distance
    From job j
    Where st_y(coordinate) Between :minLat And :maxLat
      And st_x(coordinate) Between :minLon And :maxLon
      And status = 'ACTIVE'
    ${additionalWhere}
    ${arrOrder.length > 0 ? orderString : ''}
    `;
    const replacements = {
      minLat: Number(lat) - radius / R * 180 / π,
      maxLat: Number(lat) + radius / R * 180 / π,
      minLon: Number(lng) - radius / R * 180 / π / cos(Number(lat) * π / 180),
      maxLon: Number(lng) + radius / R * 180 / π / cos(Number(lat) * π / 180),
      lat,
      lng,
    };
    const queryResult = await sequelize.query(sql, { replacements, type: QueryTypes.SELECT });

    return queryResult.map((el) => dbJobToModelJob(el));
  },
};
