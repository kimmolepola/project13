import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const updateUsername = async (username) => {
  try {
    const response = await axios.post(
      'http://localhost:8060/api/v1/user/updateUsername',
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
