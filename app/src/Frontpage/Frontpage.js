import React from 'react';
import styled from 'styled-components';
import { useHistory, Switch, Route } from 'react-router-dom';
import theme from '../theme';
import Login from './Login';
import ForgottenPassword from './ForgottenPassword';
import CreateAccount from './CreateAccount';

const Title = styled.div`
  opacity: ${theme.opacity.basic};
  font-family: ${theme.fontFamily};
  font-size: 26px;
  margin-bottom: 26px;
`;

const Container = styled.div`
  display: 'flex'};
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

const Frontpage = ({ page, setPage }) => {
  const history = useHistory();

  return (
    <Container>
      <Title>Project13</Title>
      <Switch>
        <Route path="/forgottenpassword">
          <ForgottenPassword setPage={setPage} page={page} />
        </Route>
        <Route path="/createaccount">
          <CreateAccount setPage={setPage} page={page} />
        </Route>
        <Route path="/">
          <Login history={history} setPage={setPage} page={page} />
        </Route>
      </Switch>
    </Container>
  );
};

export default Frontpage;
