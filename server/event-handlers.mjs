import * as Events from './events';
import taskMan from './task-manager';

const onTaskAdded = (socket, { url }) => {
  console.log('TaskAdded');
  taskMan.addToQueue(url);
};

const wireAllEvents = (socket) => {
  console.log('wireAllEvents');
  socket.on(Events.TaskAdded, (...args) => onTaskAdded(socket, ...args));
  taskMan.on(Events.QueueUpdated, () => socket.emit(Events.QueueUpdated, taskMan.getQueue()));
  taskMan.on(Events.TaskStatusChanged, task => socket.emit(Events.TaskStatusChanged, task));
}

const bootstrapClient = (socket) => {
  console.log('bootstrap');
  socket.emit(Events.ClientBootstrap, { tasks: taskMan.getQueue() });
  wireAllEvents(socket);
}

export default bootstrapClient;
