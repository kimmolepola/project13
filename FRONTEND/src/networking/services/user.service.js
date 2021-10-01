import axios from 'axios';

const server =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.REACT_APP_BACKEND}`
    : `http://${process.env.REACT_APP_BACKEND}`;

export const checkOkToStart = async () => {
  try {
    const response = await axios.get(` ${server}/api/v1/user/checkOkToStart`);
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get(`${server}/api/v1/user`);
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};

export const updateUsername = async (username) => {
  try {
    const response = await axios.post(`${server}/api/v1/user/updateUsername`, {
      username,
    });
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};
