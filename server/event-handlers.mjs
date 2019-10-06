import * as Events from './events';
import makeTaskManager from './task-manager';
import ytdlDownload from './download-file';

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

  taskMan = makeTaskManager({
    processOne: (item) => ytdlDownload({ item, taskMan, io }),
  });

  taskMan.on(Events.QueueUpdated, () => io.emit(Events.QueueUpdated, taskMan.getQueue()));
  taskMan.on(Events.TaskStatusChanged, task => io.emit(Events.TaskStatusChanged, task));

  const onTaskAdded = ({ url }) => {
    console.log('TaskAdded');
    taskMan.addToQueue(url);
  };

  const bootstrapClient = (socket) => {
    console.log('bootstrap');
    socket.emit(Events.ClientBootstrap, { tasks: taskMan.getQueue() });
    console.log('wireAllEvents');
    socket.on(Events.TaskAdded, onTaskAdded);
  }

  // Wire-up each client as it connects.
  io.on('connection', (socket) => {
    console.log('socket connected');
    bootstrapClient(socket);
  });
}

export default bootstrapApp;
