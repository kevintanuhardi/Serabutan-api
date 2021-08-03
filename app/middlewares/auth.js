const jwtService = require('../services/jwtService');

const { privateRoute } = require('../helpers/constant');

const checkPrivateRoute = (method, path) => {
  const privWithParamsIndexArr = privateRoute[method].map((el, index) => (el.indexOf(':') !== -1 ? index : '')).filter(String);
  const paramsRouteChecker = privateRoute[method].map((privPath, index) => {
    if (privWithParamsIndexArr.indexOf(index) === -1) return false;
    const privPathArr = privPath.split('/');
    const currPathArr = path.split('/');
    // const reqParamsIndex = privPathArr.findIndex((el) => el.indexOf(':') !== -1);
    const reqParamsIndex = privPathArr.map((el, idx) => (el.indexOf(':') !== -1 ? idx : '')).filter(String);
    let check = true;

    if (privPathArr.length !== currPathArr.length) return false;

    for (let i = 0; i < privPathArr.length; i++) {
      // eslint-disable-next-line no-continue
      if (reqParamsIndex.indexOf(i) !== -1) continue;
      check = privPathArr[i] === currPathArr[i];
      if (check === false) break;
    }
    return check === true;
  });
  if (paramsRouteChecker.indexOf(true) !== -1) return true;
  return privateRoute[method].indexOf(path) !== -1;
};

module.exports = {
  validateToken: async (req, _, next) => {
    const {
      headers,
      method,
      path,
    } = req;
    try {
      if (!checkPrivateRoute(method, path)) return next();
      const header = headers.Authorization || headers.authorization;

      if (!header) return null;

      const bearer = header.split(' ');

      const { userId } = await jwtService.getDataFromToken(bearer[1]);
      req.userId = userId;

      return next();
    } catch (err) {
      next(err);
    }
  },
};
