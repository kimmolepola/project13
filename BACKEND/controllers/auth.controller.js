const {
  guestLogin,
  login,
  signup,
  requestPasswordReset,
  resetPassword,
} = require('../services/auth.service');

const guestLoginController = async (req, res, next) => {
  const loginService = await guestLogin();
  return res.json(loginService);
};

const loginController = async (req, res, next) => {
  const loginService = await login(req.body);
  return res.json(loginService);
};

const signUpController = async (req, res, next) => {
  const signupService = await signup(req.body);
  return res.json(signupService);
};

const resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.username,
  );
  return res.json(requestPasswordResetService);
};

const resetPasswordController = async (req, res, next) => {
  const resetPasswordService = await resetPassword(
    req.body.userId,
    req.body.token,
    req.body.password,
  );
  return res.json(resetPasswordService);
};

module.exports = {
  guestLoginController,
  loginController,
  signUpController,
  resetPasswordRequestController,
  resetPasswordController,
};
