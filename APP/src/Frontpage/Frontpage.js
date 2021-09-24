import React from 'react';
import styled from 'styled-components';
import { useHistory, Switch, Route } from 'react-router-dom';
import theme from '../theme';
import Login from './components/Login';
import ForgottenPassword from './components/ForgottenPassword';
import CreateAccount from './components/CreateAccount';
import ResetPassword from './components/ResetPassword';
import LoggedIn from './components/LoggedIn';
import AppBar from './components/AppBar';

const Title = styled.button`
  display: ${(props) => (props.show ? '' : 'none')};
  cursor: pointer;
  background: none;
  border: none;
  opacity: ${theme.opacity.basic};
  font-family: ${theme.fontFamily};
  font-size: 26px;
  margin-bottom: 26px;
`;

const Container = styled.div`
.`;

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: ${(props) => (props.appbar ? theme.appbarHeight : '0px')};
  right: 0px;
  bottom: 0px;
  left: 0px;
  background: ${theme.colors.mainBackground};
`;

const Frontpage = ({ user, setUser }) => {
  const history = useHistory();

  const handleTitleClick = () => {
    history.push('/');
  };

  return (
    <Container>
      <AppBar history={history} setUser={setUser} user={user} />
      <Container2 appbar={user}>
        <Title show={!user} onClick={handleTitleClick}>
          Project13
        </Title>
        <Switch>
          <Route path="/resetpassword" component={ResetPassword} />
          <Route path="/forgottenpassword" component={ForgottenPassword} />
          <Route path="/createaccount">
            <CreateAccount user={user} setUser={setUser} history={history} />
          </Route>
          <Route path="/">
            <Login user={user} setUser={setUser} history={history} />
            <LoggedIn user={user} setUser={setUser} history={history} />
          </Route>
        </Switch>
      </Container2>
    </Container>
  );
};

export default Frontpage;
