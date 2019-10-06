import { combineReducers } from 'redux';
import inputForm from './input-form';
import tasks from './tasks';
import DefaultState from './default-state';
import * as Actions from '../actions';

const selectedTaskId = (state = DefaultState.selectedTaskId, { type, id }) =>
  type === Actions.SetSelectedTaskId ? id : state;

/**
 * @function rootReducer
 * @param {AppState} -
 * @param {Object} action -
 * @returns {AppState} -
 */
export default combineReducers({
  tasks,
  inputForm,
  selectedTaskId,
});
