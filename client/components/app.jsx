import React from 'react';
import { connect } from 'react-redux';
import './app.less';
import Tasks from './tasks';
import InputForm from './input-form';
import TaskDetails from './task-details';
import _ from 'lodash';

const App = ({ selectedTaskId }) =>
  <div id="app">
    <div id="app__mid">
      <div id="app__left"><Tasks /></div>
      <div id="app__right">
        <InputForm />
        <If condition={selectedTaskId}>
          <hr />
          <TaskDetails />
        </If>
      </div>
    </div>
  </div>

const mapStateToProps = state => _.pick(state, ['selectedTaskId'])

export default connect(mapStateToProps)(App);
