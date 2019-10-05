import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './index.less';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root)
    ReactDOM.render(<App />, root);
});
