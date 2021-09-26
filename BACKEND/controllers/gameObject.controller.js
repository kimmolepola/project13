const {
  getGameObject,
  saveGameState,
} = require('../services/gameObject.service');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const getGameObjectController = async (req, res, next) => {
  const token = getTokenFrom(req);
  const getUserService = await getGameObject(token, req.params.id);
  return res.json(getUserService);
};

const saveGameStateController = async (req, res, next) => {
  const token = getTokenFrom(req);
  const savePlayerStateService = await saveGameState(token, req.body);
  return res.json(savePlayerStateService);
};

module.exports = {
  getGameObjectController,
  saveGameStateController,
};
