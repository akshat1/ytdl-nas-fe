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

const makeTaskManager = (args) => {
  const {
    processOne,
    batchSize = 3,
    maxDoneSize = 20,
    maxPendingSize = 50,
  } = args;

  const eventEmitter = new EventEmitter();
  const done = [];
  const queue = [];
  let nextIsRunning = false;
  const inFlight = new Set();

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

  const processSingleItem = async (item) => {
    inFlight.add(item);
    console.log('Going to process', item.url);
    item.status = Status.running;
    eventEmitter.emit(Events.TaskStatusChanged, item);
    await processOne(item);
    markDone(item);
  }

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
        processSingleItem(item).then(() => setTimeout(next));
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

  return {
    on: (...args) => eventEmitter.on(...args),
    getQueue,
    addToQueue,
  };
};

export default makeTaskManager;
