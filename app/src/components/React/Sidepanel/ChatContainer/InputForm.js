import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import theme from '../../../../theme';
import appContext from '../../../../context/appContext';
import { sendDataOnOrderedChannelsAndRelay } from '../../../../messageHandler';

const Button = styled.button`
  width: 12%;
  min-width: 22px;
  color: ${theme.colors.verylight};
  background: RoyalBlue;
  box-shadow: ${theme.shadow};
  border: ${theme.borderWidth} solid ${theme.colors.light};
  border-radius: ${theme.borderRadius};
  :focus {
    border-color: ${theme.colors.strong};
    outline: none;
  }
  :hover:not(:focus) {
    border-color: ${theme.colors.medium};
  }
`;

const InputField = styled.input`
  min-width: 100px;
  padding-left: 6px;
  box-shadow: ${theme.shadow};
  border: ${theme.borderWidth} solid ${theme.colors.light};
  border-radius: ${theme.borderRadius};
  :focus {
    border-color: ${theme.colors.strong};
    outline: none;
  }
  :hover:not(:focus) {
    border-color: ${theme.colors.medium};
  }
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: lightgrey;
    opacity: 1; /* Firefox */
  }
  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: lightgrey;
  }
  flex: 1;
`;

const InputForm = styled.form`
  display: flex;
  height: 30px;
`;

const Container = styled.div``;

export default function ChatInputForm() {
  const [inputValue, setInputValue] = useState('');
  const { main, setChatMessages, id, channels, relay } = useContext(appContext);

  return (
    <Container>
      <InputForm
        onSubmit={(e) => {
          e.preventDefault();
          sendDataOnOrderedChannelsAndRelay(
            {
              main,
              id,
              setChatMessages,
              chatMessageId: Math.random().toString(),
              chatMessage: inputValue,
              type: 'chatMessage',
            },
            channels,
            relay,
          );
          setInputValue('');
        }}
        noValidate
        autoComplete="off"
      >
        <InputField
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Input"
          onFocus={(e) => {
            e.target.placeholder = '';
          }}
          onBlur={(e) => {
            e.target.placeholder = 'Input';
          }}
        />
        <Button>&#9166;</Button>
      </InputForm>
    </Container>
  );
}
