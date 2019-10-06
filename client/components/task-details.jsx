import React from 'react';
import { connect } from 'react-redux';
import './task-details.less';

const TaskDetails = ({ task }) =>
  <div className="task-details">
    <h3>Task details:</h3>
    <table className="task-details__table">
      <tr>
        <td>URL</td>
        <td>{task.url}</td>
      </tr>
      <tr>
        <td>Status</td>
        <td>{task.url}</td>
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
      Output
    </div>
  </div>

const mapStateToProps = ({ selectedTaskId, tasks }) => ({
  task: tasks.find(item => item.id === selectedTaskId),
});

export default connect(mapStateToProps)(TaskDetails);
