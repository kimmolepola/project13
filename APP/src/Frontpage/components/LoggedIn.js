import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, Switch, Route } from 'react-router-dom';
import { updateUsername } from '../../networking/services/user.service';
import theme from '../../theme';
import Settings from './Settings';

const Input = styled.input`
  ${theme.basicInput}
  height: 30px;
  margin: ${theme.margins.basic};
  ${(props) => props.error && 'border-color: red;'}
`;

const RefreshButton = styled.button`
  ${theme.basicButton}
  box-shadow: none;
  border: none;
  margin: ${theme.margins.large};
  color: ${theme.colors.elementHighlights.button1};
  background-color: ${(props) => props.background || 'transparent'};
  :disabled {
    background-color: transparent;
    cursor: default;
    transform: rotate(20turn);
    transition-duration: 6s;
  }
  font-size: 20px;
  font-weight: bold;
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

const LoggedIn = ({ refreshUser, user, setUser, history }) => {
  const [validation, setValidation] = useState({
    state: 'open',
    update: null,
    username: null,
  });
  const [username, setUsername] = useState('');
  const [errorText, setErrorText] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidation({
      state: 'open',
      update: null,
      username: null,
    });
  }, [username]);

  const handleRefreshClick = async () => {
    setLoading(true);
    await refreshUser();
    setLoading(false);
    console.log('refreshed');
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
          <div style={{ display: 'flex', margin: 40, alignItems: 'center' }}>
            Score: {user ? user.score : null}
            <RefreshButton
              disabled={loading}
              onClick={handleRefreshClick}
              type="button"
            >
              {'\u21BB'}
            </RefreshButton>
          </div>
          <Button onClick={handlePlayClick} type="button">
            play
          </Button>
        </Route>
      </Switch>
    </Container>
  );
};

export default LoggedIn;
