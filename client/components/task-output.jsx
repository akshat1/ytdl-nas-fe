import React from 'react';
import { connect } from 'react-redux'

const TaskOutput = ({ output }) =>
  <div className="task-output">
    <pre>
      <For each="chunk" of={output}>
        {chunk}
      </For>
    </pre>
  </div>

const mapStateToProps = ({ selectedTaskOutput }) => ({
  output: selectedTaskOutput,
});

export default connect(mapStateToProps)(TaskOutput);
