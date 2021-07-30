const jwtService = require('../services/jwtService');

const { privateRoute } = require('../helpers/constant');

const checkPrivateRoute = (method, path) => privateRoute[method].indexOf(path) !== -1;

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
