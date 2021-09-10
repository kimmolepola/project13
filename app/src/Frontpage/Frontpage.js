import React from 'react';
import styled from 'styled-components';
import theme from '../theme';
import Login from './Login';
import ForgottenPassword from './ForgottenPassword';
import CreateAccount from './CreateAccount';

const Title = styled.div`
  opacity: 85%;
  font-family: ${theme.fontFamily};
  font-size: 26px;
  margin-bottom: 26px;
`;

const Container = styled.div`
  display: ${(props) => (props.page !== 'game' ? 'flex' : 'none')};
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

const Frontpage = ({ page, setPage }) => (
  <>
    <Container page={page}>
      <Title>Project13</Title>
      <Login setPage={setPage} page={page} />
      <ForgottenPassword setPage={setPage} page={page} />
      <CreateAccount setPage={setPage} page={page} />
    </Container>
  </>
);

export default Frontpage;
