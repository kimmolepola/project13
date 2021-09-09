import React from 'react';
import styled from 'styled-components';
import theme from '../../../../theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: ${theme.sidepanelWidth};
  padding: 3px;
  background: red;
`;

const Connecting = ({ main, id, relay, channels }) => <Container />;

export default Connecting;
