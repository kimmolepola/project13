import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Game from './Game/Game';
import Frontpage from './Frontpage/Frontpage';
import { setToken } from './Frontpage/services/auth.service';

const App = () => {
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem('loggedProject13User')),
  );

  useEffect(() => {
    console.log('user:', user);
    window.localStorage.setItem('loggedProject13User', JSON.stringify(user));
    setToken(user ? user.token : null);
  }, [user]);

  return (
    <Router>
      <Switch>
        <Route path="/play">
          <Game user={user} />
        </Route>
        <Route path="/">
          <Frontpage setUser={setUser} user={user} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
