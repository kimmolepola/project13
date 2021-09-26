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
import { getUser } from './networking/services/user.service';

const Container = () => {
  const history = useHistory();
  const [user, setUser] = useState();

  const refreshUser = async () => {
    const item = window.localStorage.getItem('loggedProject13User');
    if (item && item !== 'null' && item !== 'undefined') {
      setToken(JSON.parse(item).token);
      const { data, error } = await getUser();
      setUser(data);
    }
    return true;
  };

  useEffect(async () => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('loggedProject13User', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('loggedProject13User');
    }
    setToken(user ? user.token : null);
  }, [user]);

  return (
    <Switch>
      <Route path="/play">
        <Game
          refreshUser={refreshUser}
          history={history}
          user={user}
          setUser={setUser}
        />
      </Route>
      <Route path="/">
        <Frontpage
          refreshUser={refreshUser}
          history={history}
          setUser={setUser}
          user={user}
        />
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
