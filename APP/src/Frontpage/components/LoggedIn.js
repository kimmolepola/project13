import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, Switch, Route } from 'react-router-dom';
import { updateUsername } from '../services/user.service';
import theme from '../../theme';
import Settings from './Settings';

const Input = styled.input`
  ${theme.basicInput}
  height: 30px;
  margin: ${theme.margins.basic};
  ${(props) => props.error && 'border-color: red;'}
`;

const Button = styled.button`
  ${theme.basicButton}
  min-height: 40px;
  min-width: 100px;
  margin: ${theme.margins.basic};
  background-color: ${(props) =>
    props.background || theme.colors.elementHighlights.button1};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
`;

const LoggedIn = ({ user, setUser, history }) => {
  const [validation, setValidation] = useState({
    state: 'open',
    update: null,
    username: null,
  });
  const [username, setUsername] = useState('');
  const [errorText, setErrorText] = useState();

  useEffect(() => {
    setValidation({
      state: 'open',
      update: null,
      username: null,
    });
  }, [username]);

  const handlePlayClick = () => {
    history.push('/play');
  };

  return (
    <Container show={user}>
      <Switch>
        <Route path="/settings">
          <Settings history={history} user={user} setUser={setUser} />
        </Route>
        <Route path="/">
          <div style={{ margin: 40 }}>Score: {user ? user.score : null}</div>
          <Button onClick={handlePlayClick} type="button">
            play
          </Button>
        </Route>
      </Switch>
    </Container>
  );
};

export default LoggedIn;
