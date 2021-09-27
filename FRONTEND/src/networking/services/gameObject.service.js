import axios from 'axios';

const server =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.REACT_APP_BACKEND}`
    : `http://${process.env.REACT_APP_BACKEND}`;

// eslint-disable-next-line import/prefer-default-export
export const getGameObject = async (id) => {
  try {
    const response = await axios.get(`${server}/api/v1/gameObject/${id}`);
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};

export const saveGameState = async (data) => {
  try {
    const response = await axios.post(
      `${server}/api/v1/gameObject/saveGameState`,
      data,
    );
    return { data: response.data, error: null };
  } catch (err) {
    const error = err.response ? err.response.data.error : err.toString();
    return { data: null, error };
  }
};
