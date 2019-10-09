import { applyMiddleware, createStore, compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import { socketMiddleware } from '../net';

let store;

/**
 * @returns {Store} -
 */
const getStore = () => {
  if (!store) {
    const composeArgs = [
      applyMiddleware(thunk, socketMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
    ];

    store = compose(...composeArgs)(createStore)(reducers);
  }

  return store;
}

export default getStore;
