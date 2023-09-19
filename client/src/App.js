import React from 'react';
import { Route, Switch } from 'react-router-dom';
import "./App.css"
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/chats" component={ChatPage} />
      </Switch>
    </div>
  );
}

export default App;