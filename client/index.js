import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './redux/store';
import App from './components/app';
import wireSocketToStore from './net';
import getClient from './io-client';
import './index.less';

document.addEventListener('DOMContentLoaded', () => {
  const store = getStore();
  wireSocketToStore({
    socket: getClient(),
    store,
  });
  const root = document.getElementById('appRoot');
  if (root)
    ReactDOM.render(<Provider store={store}><App /></Provider>, root);
});
