import React, { useState } from 'react';
import Game from './Game/Game';

const Frontpage = ({ page }) => (
  <div style={{ display: page === 'frontpage' ? '' : 'none' }}>hello</div>
);

const App = () => {
  const [page, setPage] = useState('frontpage');

  return (
    <>
      <Frontpage page={page} />
      <Game page={page} />
    </>
  );
};

export default App;
