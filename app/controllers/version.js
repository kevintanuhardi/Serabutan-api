/* global Helpers */
const fs = require('fs');
const path = require('path');

module.exports = {
  getVersion: (req, res) => {
    const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
    const rawFile = fs.readFileSync(path.join(__dirname, '..', '..', `version-${environment}.json`));
    const versionObj = JSON.parse(rawFile);
    return Helpers.successResponse(res, 200, versionObj);
  },
};
