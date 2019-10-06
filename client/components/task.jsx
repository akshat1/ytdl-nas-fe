import React from 'react';
import classNames from 'classnames';
import './task.less';

const printableURL = url => decodeURI(url).replace(/^(http)s?:\/\/(www\.)?/, '');

const getTitle = ({ status, url }) => `${status}, ${url}`;

const Task = ({ task }) =>
  <div className={classNames('task', `task--${task.status}`)}>
    <div className="task__url" title={getTitle(task)}>{printableURL(task.url)}</div>
  </div>

export default Task;
