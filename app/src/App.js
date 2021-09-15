import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Game from './Game/Game';
import Frontpage from './Frontpage/Frontpage';

const App = () => (
  <Router>
    <Switch>
      <Route path="/play">
        <Game />
      </Route>
      <Route path="/">
        <Frontpage />
      </Route>
    </Switch>
  </Router>
);

export default App;
