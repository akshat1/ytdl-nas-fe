import React from 'react';
import { connect } from 'react-redux';
import TaskOutput from './task-output';
import './task-details.less';

const TaskDetails = ({ task }) =>
  <If condition={task}>
    <div className="task-details">
      <h3>Task details:</h3>
      <table className="task-details__table">
        <tr>
          <td>URL</td>
          <td><a href={task.url}>{task.url}</a></td>
        </tr>
        <tr>
          <td>Status</td>
          <td className="task-details__status">{task.status}</td>
        </tr>
        <tr>
          <td>Added</td>
          <td>{new Date(task.added).toLocaleTimeString()}</td>
        </tr>
        <If condition={task.finished}>
          <tr>
            <td>Finished</td>
            <td>{new Date(task.finished).toLocaleTimeString()}</td>
          </tr>
        </If>
      </table>
      <div className="task-details__output">
        <TaskOutput />
      </div>
    </div>
  </If>

const mapStateToProps = ({ selectedTaskId, tasks }) => ({
  task: tasks.find(item => item.id === selectedTaskId),
});

export default connect(mapStateToProps)(TaskDetails);
