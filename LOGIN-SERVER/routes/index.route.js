const router = require('express').Router();
const { updateUsernameController } = require('../controllers/user.controller');
const {
  loginController,
  signUpController,
  resetPasswordRequestController,
  resetPasswordController,
} = require('../controllers/auth.controller');

router.post('/user/updateUsername', updateUsernameController);
router.post('/auth/login', loginController);
router.post('/auth/signup', signUpController);
router.post('/auth/requestResetPassword', resetPasswordRequestController);
router.post('/auth/resetPassword', resetPasswordController);

module.exports = router;
