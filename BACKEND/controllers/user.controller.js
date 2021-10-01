const {
  checkOkToStart,
  getUser,
  updateUsername,
} = require('../services/user.service');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const checkOkToStartController = (req, res, next) => {
  const token = getTokenFrom(req);
  const checkOkToStartService = checkOkToStart(token);
  return res.json(checkOkToStartService);
};

const getUserController = async (req, res, next) => {
  const token = getTokenFrom(req);
  const getUserService = await getUser(token);
  return res.json(getUserService);
};

const updateUsernameController = async (req, res, next) => {
  const token = getTokenFrom(req);
  const updateUsernameService = await updateUsername(token, req.body);
  return res.json(updateUsernameService);
};

module.exports = {
  checkOkToStartController,
  getUserController,
  updateUsernameController,
};
