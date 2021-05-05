import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Login from './Login';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Login />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
