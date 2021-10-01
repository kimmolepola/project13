const router = require('express').Router();
const {
  getGameObjectController,
  saveGameStateController,
} = require('../controllers/gameObject.controller');
const {
  checkOkToStartController,
  getUserController,
  updateUsernameController,
} = require('../controllers/user.controller');
const {
  guestLoginController,
  loginController,
  signUpController,
  resetPasswordRequestController,
  resetPasswordController,
} = require('../controllers/auth.controller');

router.get('/gameObject/:id', getGameObjectController);
router.post('/gameObject/saveGameState', saveGameStateController);
router.get('/user/checkOkToStart', checkOkToStartController);
router.get('/user', getUserController);
router.post('/user/updateUsername', updateUsernameController);
router.post('/auth/guestLogin', guestLoginController);
router.post('/auth/login', loginController);
router.post('/auth/signup', signUpController);
router.post('/auth/requestResetPassword', resetPasswordRequestController);
router.post('/auth/resetPassword', resetPasswordController);

module.exports = router;
