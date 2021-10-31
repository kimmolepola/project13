import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import theme from '../../../../../theme';
import appContext from '../../../../../context/appContext';
import { sendDataOnOrderedChannelsAndRelay } from '../../../../../networking/services/game.service';

const Button = styled.button`
  width: 12%;
  min-width: 22px;
  ${theme.basicButton}
`;

const InputField = styled.input`
  ${theme.basicInput}
  min-width: 40px;
  flex: 1;
`;

const InputForm = styled.form`
  display: flex;
  height: 30px;
`;

const Container = styled.div``;

export default function ChatInputForm() {
  const [inputValue, setInputValue] = useState('');
  const { connection, username, main, setChatMessages, id } =
    useContext(appContext);

  return (
    <Container>
      <InputForm
        onSubmit={(e) => {
          e.preventDefault();
          sendDataOnOrderedChannelsAndRelay(
            {
              username,
              main,
              id,
              setChatMessages,
              chatMessageId: Math.random().toString(),
              chatMessage: inputValue,
              type: 'chatMessage',
            },
            connection,
          );
          setInputValue('');
        }}
        noValidate
        autoComplete="off"
      >
        <InputField
          type="text"
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
