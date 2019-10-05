import { combineReducers } from 'redux';

/**
 * @typedef AppState
 * @property {Object[]} Queue -
 */

/**
 * @constant {AppState}
 */
const DefaultState = {
  queue: [],
};

/**
 * @param {Object[]} state -
 * @returns {Object[]} -
 */
const queue = (state = DefaultState.queue) => state;

/**
 * @function rootReducer
 * @param {AppState} -
 * @param {Object} action -
 * @returns {AppState} -
 */
export default combineReducers({
  queue,
})
