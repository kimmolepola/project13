import axios from 'axios';

export const requestPasswordReset = async ({ username }) => {
  try {
    const response = await axios.post(
      'http://localhost:8060/api/v1/auth/requestResetPassword',
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
    const response = await axios.post(
      'http://localhost:8060/api/v1/auth/login',
      {
        username,
        password,
      },
    );
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};

export const signup = async ({ email, password }) => {
  try {
    const response = await axios.post(
      'http://localhost:8060/api/v1/auth/signup',
      {
        email,
        password,
      },
    );
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};
