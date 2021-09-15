import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Game from './Game/Game';
import Frontpage from './Frontpage/Frontpage';

const App = () => {
  const [page, setPage] = useState('login');

  return (
    <Router>
      <Switch>
        <Route path="/play">
          <Game page={page} />
        </Route>
        <Route path="/">
          <Frontpage setPage={setPage} page={page} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
