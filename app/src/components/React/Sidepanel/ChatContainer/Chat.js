import React, { useContext } from 'react';
import styled from 'styled-components';
import theme from '../../../../theme';
import appContext from '../../../../context/appContext';

const Avatar = styled.img`
  margin-left: auto;
  height: 30px;
  width: 30px;
  border-radius: ${theme.borderRadius};
`;

const Message = styled.div`
  overflow-anchor: none;
  display: flex;
  padding: 3px 3px 3px 6px;
`;

const Text = styled.div`
  margin-right: 3px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
`;

const Divider = styled.hr`
  border-style: solid;
  border-color: ${theme.colors.verylight} transparent transparent;
  margin: 0;
`;

const Container = styled.div`
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 8px ${theme.colors.light};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.medium};
    outline: 1px solid ${theme.colors.light};
  }
  display: flex;
  flex-direction: column-reverse;
  max-height: calc(100% - 30px);
  overflow-y: auto;
  scrollbar-width: thin;
  background: white;
  box-shadow: ${theme.shadow};
  border: ${theme.borderWidth} solid ${theme.colors.light};
  border-radius: ${theme.borderRadius};
`;

export default function Chat() {
  const { messages, ownId } = useContext(appContext);

  return (
    <Container>
      {messages.map((x, index) => (
        <div key={x.messageId}>
          <Divider
            style={{ display: index !== messages.length - 1 ? '' : 'none' }}
          />
          <Message
            style={{ background: x.userId === ownId ? 'yellow' : 'none' }}
          >
            <Text>
              {x.userId}: {x.message}
            </Text>
            <Avatar src="avatar.jpg" alt="Avatar" />
          </Message>
        </div>
      ))}
    </Container>
  );
}

/*
  box-shadow: ${theme.shadow};
  border: ${theme.borderWidth} solid ${theme.colors.light};
  border-radius: ${theme.borderRadius};
*/
