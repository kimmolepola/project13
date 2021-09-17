import axios from 'axios';

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
  } catch (error) {
    return { data: null, error: error.response.data.error };
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
  } catch (error) {
    return { data: null, error: error.response.data.error };
  }
};
