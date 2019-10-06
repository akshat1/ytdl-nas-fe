import React from 'react';
import './app.less';
import Tasks from './tasks';
import InputForm from './input-form';

const App = () =>
  <div id="app">
    <div id="app__mid">
      <div id="app__left"><Tasks /></div>
      <div id="app__right"><InputForm /></div>
    </div>
  </div>

export default App;
