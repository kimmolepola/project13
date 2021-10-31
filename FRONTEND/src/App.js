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
    console.log('refreshUser');
    const item = window.localStorage.getItem('loggedProject13User');
    if (item && item !== 'null' && item !== 'undefined') {
      console.log('refreshUser - setToken:', JSON.parse(item).token);
      setToken(JSON.parse(item).token);
      const { data, error } = await getUser();
      console.log('refreshUser - setUser:', data);
      setUser(data);
    }
    return true;
  };

  useEffect(async () => {
    refreshUser();
  }, []);

  useEffect(() => {
    console.log('useEffect[user]');
    if (user) {
      console.log(
        'useEffect[user] - localStorage.setItem:',
        JSON.stringify(user),
      );
      window.localStorage.setItem('loggedProject13User', JSON.stringify(user));
    } else {
      console.log('useEffect[user] - localStorage.removeItem - commented out');
      // window.localStorage.removeItem('loggedProject13User');
    }
    console.log('useEffect[user] - setToken:', user ? user.token : null);
    setToken(user ? user.token : null);
  }, [user]);

  return (
    <Switch>
      <Route path="/play">
        <Game refreshUser={refreshUser} history={history} user={user} />
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
