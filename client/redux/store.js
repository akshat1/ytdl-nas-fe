import { createStore } from 'redux';
import reducers from './reducers';

let store;

/**
 * @returns {Store} -
 */
const getStore = () => {
  if (!store) {
    store = createStore(
      reducers,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    );
  }

  return store;
}

export default getStore;
