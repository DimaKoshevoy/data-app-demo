import React from 'react';
import {Provider} from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import {store} from './store/store'
import {Tokens} from './tokens/tokens';
import {Header, HEADER_HEIGHT} from './components/header';
import {SingleToken} from './single-token/single-token';
import './app.css';

const containerHeight = `calc(100vh - ${HEADER_HEIGHT}px)`;

export const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header/>
        <div className="container mx-auto space-y-4 h-full overflow-x-scroll overflow-y-hidden" style={{height: containerHeight}}>
          <Switch>
            <Route path="/" exact>
              <Tokens/>
            </Route>
            <Route path="/token/:address" exact>
              <SingleToken/>
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}
