import React, { useState } from 'react';
import Game from './Game/Game';
import Frontpage from './Frontpage/Frontpage';

const App = () => {
  const [page, setPage] = useState('frontpage');

  return (
    <>
      <Frontpage setPage={setPage} page={page} />
      <Game page={page} />
    </>
  );
};

export default App;
