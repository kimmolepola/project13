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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newValidation = {
      state: 'open',
      update: null,
      username: username.length ? null : 'can not be empty',
    };
    if (!newValidation.username) {
      newValidation.state = 'loading';
      setValidation(newValidation);
      const { data, error } = await updateUsername(username);
      newValidation.login = error;
      newValidation.state = 'open';
      if (!error) {
        setUser(data);
        setUsername('');
      }
    }
    setValidation({ ...newValidation });
  };

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
          <Button onClick={handlePlayClick} type="button">
            play
          </Button>
        </Route>
      </Switch>
    </Container>
  );
};

export default LoggedIn;
