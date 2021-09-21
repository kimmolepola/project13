import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, Switch, Route } from 'react-router-dom';
import theme from '../theme';
import Login from './Login';
import ForgottenPassword from './ForgottenPassword';
import CreateAccount from './CreateAccount';
import ResetPassword from './ResetPassword';
import LoggedIn from './LoggedIn';
import { setToken } from './services/auth.service';

const Title = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  opacity: ${theme.opacity.basic};
  font-family: ${theme.fontFamily};
  font-size: 26px;
  margin-bottom: 26px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: ${theme.colors.mainBackground};
`;

const Frontpage = () => {
  const history = useHistory();
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem('loggedProject13User')),
  );

  useEffect(() => {
    window.localStorage.setItem('loggedProject13User', JSON.stringify(user));
    setToken(user ? user.token : null);
  }, [user]);

  const handleTitleClick = () => {
    history.push('/');
  };

  return (
    <Container>
      <Title onClick={handleTitleClick}>Project13</Title>
      <Switch>
        <Route path="/resetpassword" component={ResetPassword} />
        <Route path="/forgottenpassword" component={ForgottenPassword} />
        <Route path="/createaccount">
          <CreateAccount user={user} setUser={setUser} history={history} />
        </Route>
        <Route path="/login">
          <Login user={user} setUser={setUser} history={history} />
        </Route>
        <Route path="/">
          <Login user={user} setUser={setUser} history={history} />
          <LoggedIn user={user} setUser={setUser} history={history} />
        </Route>
      </Switch>
    </Container>
  );
};

export default Frontpage;
