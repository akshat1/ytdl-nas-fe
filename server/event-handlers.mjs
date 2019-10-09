import * as Event from './event.mjs';
import makeTaskManager from './task-manager.mjs';
import ytdlDownload from './download-file.mjs';

/*
When a user connects, we send them the current task list via the ClientBootstrap event.
When a task is added, we emit the QueueUpdated event on the socket, sending all clients the current queue.
When a task status changes, we send the latest definition of the task down the wires using TaskStatusChanged.
TODO:
  - when a task is added, create a new room (clients will connect to that room when the user selects the corresponding task in the UI).
  - publish all updates from processOne (for instance, updates from curl/aria etc.) to the said room. the clients will use that to display the process output in the browser.
  - keep the output for each task in a buffer. send that buffer to the user when the user connects to the correspnding room (basically, a 'bootsrtap client for room' event).
*/

const bootstrapApp = io => {
  let taskMan;

  // Real dirty deeds now. This WILL lead to a memory leak.
  const outputBuffer = {};

  const progress = ({ id }, output) => {
    if (!outputBuffer[id]) {
      outputBuffer[id] = [];
    }

    const opBuff = outputBuffer[id];
    opBuff.push(output);
    io.of(`/${id}`).emit(Event.TaskProgress, output);
  }

  taskMan = makeTaskManager({
    processOne: (item) => ytdlDownload({ item, taskMan, io, progress }),
  });

  taskMan.on(Event.QueueUpdated, () => io.emit(Event.QueueUpdated, taskMan.getQueue()));
  taskMan.on(Event.TaskStatusChanged, task => io.emit(Event.TaskStatusChanged, task));

  const onTaskAdded = ({ id,  url }) => {
    console.log('TaskAdded');
    taskMan.addToQueue(url);
    progress({ id }, 'Added to queue');
    const nspace = io.of(`/${id}`);
    nspace.on('connection', socket => {
      console.log(`joined /${id}`);
      socket.emit(Event.ClientNSpaceBootstrap, {
        id,
        output: outputBuffer[id],
      });
    });
  };

  const bootstrapClient = (socket) => {
    console.log('bootstrap');
    socket.emit(Event.ClientBootstrap, { tasks: taskMan.getQueue() });
    console.log('wireAllEvents');
    socket.on(Event.TaskAdded, onTaskAdded);
  }

  // Wire-up each client as it connects.
  io.on('connection', (socket) => {
    console.log('socket connected');
    bootstrapClient(socket);
  });
}

export default bootstrapApp;
