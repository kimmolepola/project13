const {
  getUser,
  saveGameState,
  updateUsername,
} = require('../services/user.service');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const getUserController = async (req, res, next) => {
  console.log('getuser controller req:', req);
  const token = getTokenFrom(req);
  const getUserService = await getUser(token);
  return res.json(getUserService);
};

const saveGameStateController = async (req, res, next) => {
  const token = getTokenFrom(req);
  console.log('save game state:', token, req.body);
  const savePlayerStateService = await saveGameState(token, req.body);
  return res.json(savePlayerStateService);
};

const updateUsernameController = async (req, res, next) => {
  const token = getTokenFrom(req);
  const updateUsernameService = await updateUsername(token, req.body);
  return res.json(updateUsernameService);
};

module.exports = {
  getUserController,
  saveGameStateController,
  updateUsernameController,
};
