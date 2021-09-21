const { updateUsername } = require('../services/user.service');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const updateUsernameController = async (req, res, next) => {
  const token = getTokenFrom(req);
  const updateUsernameService = await updateUsername(token, req.body);
  return res.json(updateUsernameService);
};

module.exports = {
  updateUsernameController,
};
