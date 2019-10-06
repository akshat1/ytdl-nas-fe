import { combineReducers } from 'redux';
import inputForm from './input-form';
import tasks from './tasks';

/**
 * @function rootReducer
 * @param {AppState} -
 * @param {Object} action -
 * @returns {AppState} -
 */
export default combineReducers({
  tasks,
  inputForm,
})
