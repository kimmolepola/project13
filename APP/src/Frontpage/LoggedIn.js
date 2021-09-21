import React, { useState } from 'react';
import { updateUsername } from './services/user.service';

const LoggedIn = ({ user, setUser, history }) => {
  const [username, setUsername] = useState('');
  const [errorText, setErrorText] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await updateUsername(username);
    setErrorText(error);
    if (!error) {
      setUser(data);
    }
  };

  return (
    <div style={{ display: user ? '' : 'none' }}>
      Hello{' '}
      {user
        ? `${user.username} id2token: ${user.id2token.substring(0, 10)}...`
        : null}
      <p />
      {errorText}
      <p />
      <form onSubmit={handleSubmit}>
        <input
          placeholder="new username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
      <button
        onClick={() => {
          history.push('/play');
        }}
        type="button"
      >
        play
      </button>
      <button
        onClick={() => {
          setUser(null);
          window.localStorage.removeItem('loggedProject13User');
        }}
        type="button"
      >
        logout
      </button>
    </div>
  );
};

export default LoggedIn;
