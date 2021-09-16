const {
  login,
  signup,
  requestPasswordReset,
  resetPassword,
} = require('../services/auth.service');

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
    req.body.email,
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
  loginController,
  signUpController,
  resetPasswordRequestController,
  resetPasswordController,
};
