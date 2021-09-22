import axios from 'axios';

const xserverUri = process.env.REACT_APP_LOGIN_SERVER;
const serverUri = '192.168.132.87:8060';

// eslint-disable-next-line import/prefer-default-export
export const updateUsername = async (username) => {
  try {
    const response = await axios.post(
      `http://${serverUri}/api/v1/user/updateUsername`,
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
