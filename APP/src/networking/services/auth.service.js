import axios from 'axios';

const server = process.env.REACT_APP_LOGIN_SERVER;
// const serverUri = '192.168.132.87:8060';

export const setToken = (token) => {
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
};

export const resetPassword = async ({ token, userId, password }) => {
  try {
    const response = await axios.post(`${server}/api/v1/auth/resetpassword`, {
      token,
      userId,
      password,
    });
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};

export const requestPasswordReset = async ({ username }) => {
  try {
    const response = await axios.post(
      `${server}/api/v1/auth/requestResetPassword`,
      {
        username,
      },
    );
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};

export const login = async ({ username, password }) => {
  try {
    const response = await axios.post(`${server}/api/v1/auth/login`, {
      username,
      password,
    });
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};

export const signup = async ({ email, password }) => {
  try {
    const response = await axios.post(`${server}/api/v1/auth/signup`, {
      email,
      password,
    });
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};
