import React, { useEffect, useState } from 'react';
import {
  useHistory,
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Game from './Game/Game';
import Frontpage from './Frontpage/Frontpage';
import { setToken } from './networking/services/auth.service';

const Container = () => {
  const history = useHistory();
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem('loggedProject13User')),
  );

  useEffect(() => {
    window.localStorage.setItem('loggedProject13User', JSON.stringify(user));
    setToken(user ? user.token : null);
  }, [user]);

  return (
    <Switch>
      <Route path="/play">
        <Game history={history} user={user} setUser={setUser} />
      </Route>
      <Route path="/">
        <Frontpage history={history} setUser={setUser} user={user} />
      </Route>
    </Switch>
  );
};

const App = () => (
  <Router>
    <Container />
  </Router>
);

export default App;
