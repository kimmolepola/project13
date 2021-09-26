const router = require('express').Router();
const {
  getUserController,
  saveGameStateController,
  updateUsernameController,
} = require('../controllers/user.controller');
const {
  loginController,
  signUpController,
  resetPasswordRequestController,
  resetPasswordController,
} = require('../controllers/auth.controller');

router.get('/user', getUserController);
router.post('/user/saveGameState', saveGameStateController);
router.post('/user/updateUsername', updateUsernameController);
router.post('/auth/login', loginController);
router.post('/auth/signup', signUpController);
router.post('/auth/requestResetPassword', resetPasswordRequestController);
router.post('/auth/resetPassword', resetPasswordController);

module.exports = router;
