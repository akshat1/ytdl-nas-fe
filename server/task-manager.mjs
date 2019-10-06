import EventEmitter from 'events';
import * as Events from './events';
import md5 from 'blueimp-md5';

/**
 * @enum {string} Status -
 */
export const Status = {
  pending: 'pending',
  running: 'running',
  complete: 'complete',
  failed: 'failed',
};

const eventEmitter = new EventEmitter();
const done = [];
const queue = [];
let nextIsRunning = false;
const inFlight = new Set();
const batchSize = 1;
const maxDoneSize = 100;
const maxPendingSize = 100;

const markDone = item => {
  console.log('markDone', item.url);
  inFlight.delete(item);
  queue.splice(queue.indexOf(item), 1);
  item.status = Status.complete;
  item.finished = Date.now();
  done.push(item);
  while(done.length >= maxDoneSize)
    done.unshift();
  eventEmitter.emit(Events.TaskStatusChanged, item);
}

const processOne = (item) =>
  new Promise(resolve => {
    inFlight.add(item);
    console.log('Going to process', item.url);
    item.status = Status.running;
    eventEmitter.emit(Events.TaskStatusChanged, item);
    setTimeout(() => {
      markDone(item);
      resolve();
    }, 30000)
  });

const next = () => {
  console.log('next')
  if (!nextIsRunning) {
    console.log('...');
    nextIsRunning = true;
    while (inFlight.size < batchSize) {
      // Find the first item that is not already in flight.
      const item = queue.find(item => item.status === Status.pending);
      if (!item)
        break;
      processOne(item).then(() => setTimeout(next));
    }
    nextIsRunning = false;
  }
  console.log('txen');
}

const getQueue = () =>
  [
    ...done,
    ...queue,
  ]

const addToQueue = (url) => {
  console.log('addToQueue', url);
  if (queue.length >= maxPendingSize) {
    throw new Error('Max queue size reached');
  }

  if(queue.find(item => item.url === url)) {
    console.log('duplicate. ignore.');
    return;
  }

  const item = {
    id: md5(url),
    url,
    status: Status.pending,
    added: Date.now(),
  };
  queue.push(item);
  eventEmitter.emit(Events.QueueUpdated, item);
  next();
}

export default {
  on: (...args) => eventEmitter.on(...args),
  getQueue,
  addToQueue,
};
