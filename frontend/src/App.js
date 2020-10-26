import React, { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';
import './App.css';

function App () {

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
    setTokenExpiration(tokenExpiration);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    //setTokenExpiration(null);
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          token,
          userId,
          tokenExpiration,
          login,
          logout
        }}>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            {!token &&
              <Redirect path="/" to="/auth" exact />
            }
            {token &&
              <Redirect path="/" to="/events" exact />
            }
            {token &&
              <Redirect path="/auth" to="/events" exact />
            }
            {!token &&
              <Route path="/auth" component={AuthPage} />
            }
            <Route path="/events" component={EventsPage} />
            {token &&
              <Route path="/bookings" component={BookingsPage} />
            }
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
