import _ from 'lodash';
import { updateQueue } from './redux/actions';
import * as Events from '../server/events.mjs';

/**
 * 
 * @param {SocketIO} socket -
 * @param {import('redux').Store} store -
 */
const wireSocketToStore = ({ socket, store }) => {
  socket.on(Events.QueueUpdated, (queue) => {
    console.log('Queue Updated');
    store.dispatch(updateQueue(queue));
  });

  socket.on(Events.TaskStatusChanged, (updatedTask) => {
    console.log('Task Status Changed');
    const tasks = [
      ...store.getState().tasks.filter(({ id }) => id !== updatedTask.id),
      updatedTask,
    ]

    store.dispatch(updateQueue(tasks));
  });

  socket.on(Events.ClientBootstrap, ({ tasks }) => {
    store.dispatch(updateQueue(tasks))
  });
}

export default wireSocketToStore;
