import * as Event from './event.mjs';
import makeTaskManager from './task-manager.mjs';
import ytdlDownload from './download-file.mjs';
import assert from 'assert';
import md5 from 'blueimp-md5';

/*
When a user connects, we send them the current task list via the ClientBootstrap event.
When a task is added, we emit the QueueUpdated event on the socket, sending all clients the current queue.
When a task status changes, we send the latest definition of the task down the wires using TaskStatusChanged.
TODO:
  - when a task is added, create a new room (clients will connect to that room when the user selects the corresponding task in the UI).
  - publish all updates from processOne (for instance, updates from curl/aria etc.) to the said room. the clients will use that to display the process output in the browser.
  - keep the output for each task in a buffer. send that buffer to the user when the user connects to the correspnding room (basically, a 'bootsrtap client for room' event).
*/

const onConnection = ({ socket, io }) => {
  let taskMan;
  // Real dirty deeds now. This WILL lead to a memory leak.
  const outputBuffer = {};

  const onProgress = ({ id, output: buff }) => {
    const output = buff.toString();
    assert.equal(typeof id, 'string', 'onProgress missing id');
    console.log(`Progress for ${id}`);
    if (!outputBuffer[id]) {
      console.log('Created output buffer');
      outputBuffer[id] = [];
    }

    const opBuff = outputBuffer[id];
    console.log('>>...');
    opBuff.push(output);
    console.log('Emit to ', id);
    console.log({
      id,
      output,
    });
    io.to(id).emit(Event.TaskProgress, {
      id,
      output,
    });
  }

  taskMan = makeTaskManager({
    processOne: (item) => ytdlDownload({ item, taskMan, io, onProgress }),
  });

  const onTaskAdded = ({ url }) => {
    console.log('TaskAdded');
    taskMan.addToQueue(url);
    onProgress({ id: md5(url), output: 'Added to queue\n' });
  };

  taskMan.on(Event.QueueUpdated, () => io.emit(Event.QueueUpdated, taskMan.getQueue()));
  taskMan.on(Event.TaskStatusChanged, task => io.emit(Event.TaskStatusChanged, task));

  console.log('bootstrap');
  socket.emit(Event.ClientBootstrap, { tasks: taskMan.getQueue() });
  console.log('wireAllEvents');
  socket.on(Event.TaskAdded, onTaskAdded);

  socket.on(Event.ClientLeave, ({ id }) => {
    assert.equal(typeof id, 'string', 'ClientLeave event missing id');
    socket.leave(id);
  });

  socket.on(Event.ClientJoin, ({ id }) => {
    assert.equal(typeof id, 'string', 'ClientJoin event missing id');
    console.log('ClientJoin', id);
    socket.join(id);
    socket.emit(Event.ClientNSpaceBootstrap, {
      id,
      output: outputBuffer[id],
    });
  });
}

const bootstrapApp = io => {
  // Wire-up each client as it connects.
  io.on('connection', (socket) => {
    console.log('socket connected');
    onConnection({ socket, io });
  });
}

export default bootstrapApp;
