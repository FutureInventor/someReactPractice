import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';
import MyContextProvider from './components/context/context';
__webpack_public_path__ = `${window.STATIC_URL}/app/assets/bundle/`;

const routing = (
  <MyContextProvider>
  <div>
    <Router>
      <div>
        <Home/>
      </div>
    </Router>
  </div>
  </MyContextProvider>
)


ReactDOM.render(routing, document.getElementById('app'))