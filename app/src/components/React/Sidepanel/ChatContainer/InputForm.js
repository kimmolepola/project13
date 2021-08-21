import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import theme from '../../../../theme';
import appContext from '../../../../context/appContext';
import { sendMessage } from '../../../../events/networkEvents';

const Container = styled.div``;

const InputField = styled.input`
  padding-left: 6px;
  :focus {
    border-color: ${theme.colors.strong};
    outline: none;
  }
  :hover:not(:focus) {
    border-color: ${theme.colors.medium};
  }
  box-shadow: ${theme.shadow};
  border: ${theme.borderWidth} solid ${theme.colors.light};
  border-radius: ${theme.borderRadius};
  height: 30px;
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
`;

export default function ChatInputForm() {
  const [inputValue, setInputValue] = useState('');
  const { id, channels, relay } = useContext(appContext);

  return (
    <Container>
      <InputForm
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(inputValue, id, channels, relay);
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
      </InputForm>
    </Container>
  );
}
