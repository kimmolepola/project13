import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const ButtonsContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
`;

const Settings = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  font-family: ${theme.fontFamily};
  font-size: 28px;
  font-weight: bold;
  color: ${theme.colors.elementHighlights.button1};
  padding: 0px;
  margin: 0px 3%;
`;

const Button = styled.button`
  ${theme.basicButton}
  background-color: ${(props) =>
    props.background || theme.colors.elementHighlights.button1};
  padding: 0px 14px;
  color: ${(props) => props.color || 'white'};
  height: 60%;
  margin: 0px ${theme.margins.large};
`;

const Title = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  font-family: ${theme.fontFamily};
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.elementHighlights.button1};
  margin-left: calc(${theme.margins.large} + 0.4%);
  padding: 0px;
`;

const Text = styled.div`
  margin: ${theme.margins.large};
  opacity: ${theme.opacity.basic};
  font-family: ${theme.fontFamily};
  font-size: 16px;
  text-align: center;
`;

const Container = styled.div`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  justify-content: space-between;
  background: ${theme.colors.elementBackgrounds.verylight};
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  height: ${theme.appbarHeight};
  align-items: center;
`;

const AppBar = ({ history, setUser, user }) => {
  const handleLogoutClick = () => {
    setUser(null);
    window.localStorage.removeItem('loggedProject13User');
    history.push('/');
  };
  const handleSettingsClick = () => {
    history.push('/settings');
  };
  const handleTitleClick = () => {
    history.push('/');
  };

  return (
    <Container show={user}>
      <Title show={!user} onClick={handleTitleClick}>
        Project13
      </Title>

      <Text>Hi, {user ? user.username : null}</Text>
      <ButtonsContainer>
        <Settings onClick={handleSettingsClick}>{'\u2699'}</Settings>
        <Button
          color={theme.colors.elementHighlights.button1}
          background="transparent"
          onClick={handleLogoutClick}
          type="button"
        >
          logout
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

export default AppBar;
