import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './redux/store';
import App from './app';
import './index.less';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root)
    ReactDOM.render(<Provider store={getStore()}><App /></Provider>, root);
});
