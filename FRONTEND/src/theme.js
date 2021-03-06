const borderRadius = '2px';
const borderWidth = '1px';
const shadow = '0px 0px 1px 0px #A0A0A0';
const colors = {
  mainBackground: 'mistyrose',
  elementHighlights: {
    button1: 'brown',
    button2: 'tomato',
  },
  elementBackgrounds: {
    strong: 'lightblue',
    medium: '#A0A0A0',
    light: 'gainsboro',
    verylight: '#F0F0F0',
  },
};

const border = `${borderWidth} solid ${colors.elementBackgrounds.light}`;

const basicButton = `
  cursor: pointer;
  color: white;
  background: ${colors.elementHighlights.button1};
  box-shadow: ${shadow};
  border: ${border};
  border-radius: ${borderRadius};
  :active {
    color: ${colors.elementBackgrounds.verylight};
    background: black;
  }
  :focus {
    border-color: ${colors.elementBackgrounds.strong};
    outline: none;
  }
  :hover:not(:focus) {
    border-color: ${colors.elementBackgrounds.medium};
  }
  :disabled {
    background-color: ${colors.elementBackgrounds.light};
    :hover:not(:focus) {
      border-color: ${colors.elementBackgrounds.light};
    }
    cursor: auto;
  }
`;

const secondaryButton = `
  ${basicButton}
  background: ${colors.elementHighlights.button2};
`;

const theme = {
  appbarHeight: '15mm',
  opacity: {
    basic: '85%',
  },
  borders: {
    basic: border,
  },
  margins: {
    basic: '2px',
    large: '6px',
  },
  fontFamily: 'Arial, Helvetica, sans-serif',
  basicInput: `
    padding-left: 6px;
    box-shadow: ${shadow};
    border: ${border};
    border-radius: ${borderRadius};
    :focus {
      border-color: ${colors.elementBackgrounds.strong};
      outline: none;
    }
    :hover:not(:focus) {
      border-color: ${colors.elementBackgrounds.medium};
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
  `,
  basicButton,
  secondaryButton,
  mobileWidth: 600,
  sidepanelWidthPercent: 30,
  sidepanelMaxWidth: '300px',
  colors,
  shadow,
  borderRadius,
};

export default theme;
