import { createStore } from 'redux';
import reducers from './reducers';

let store;

/**
 * @returns {Store} -
 */
const getStore = () => {
  if (!store) {
    store = createStore(reducers);
  }

  return store;
}

export default getStore;
