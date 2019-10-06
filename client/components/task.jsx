import React from 'react';
import classNames from 'classnames';
import './task.less';
import { selectTask } from '../redux/actions';
import { connect } from 'react-redux';

const printableURL = url => decodeURI(url).replace(/^(http)s?:\/\/(www\.)?/, '');

const getTitle = ({ status, url }) => `${status}, ${url}`;

const getContainerClassNames = ({ isSelected, task }) =>
  classNames(
    'task',
    `task--${task.status}`,
    { 'task--selected' : isSelected },
  );

const Task = ({ task, selectTask, isSelected }) =>
  <div className={getContainerClassNames({ isSelected, task })}>
    <div className="task__url" title={getTitle(task)}>
      <a href='#' onClick={selectTask}>
        {printableURL(task.url)}
      </a>
    </div>
  </div>

const mapStateToProps = ({ selectedTaskId }, { task }) => ({
  isSelected: task.id === selectedTaskId,
});

const mapDispatchToProps = (dispatch, { task }) => ({
  selectTask: () => dispatch(selectTask(task)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Task);
