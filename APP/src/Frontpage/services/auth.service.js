import axios from 'axios';

// eslint-disable-next-line
export const signup = async ({ email, password, setUser }) => {
  try {
    const response = await axios.post(
      'http://localhost:8060/api/v1/auth/signup',
      {
        email,
        password,
      },
    );
    setUser(response.data);
    window.localStorage.setItem(
      'loggedProject13User',
      JSON.stringify(response.data),
    );
    return null;
  } catch (error) {
    return error.response.data.error;
  }
};
