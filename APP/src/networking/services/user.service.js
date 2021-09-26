import axios from 'axios';

const server = process.env.REACT_APP_LOGIN_SERVER;

export const getUser = async () => {
  try {
    const response = await axios.get(`${server}/api/v1/user`);
    console.log('response');
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};

export const saveGameState = async (data) => {
  console.log('save game state', data);
  try {
    const response = await axios.post(
      `${server}/api/v1/user/saveGameState`,
      data,
    );
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
