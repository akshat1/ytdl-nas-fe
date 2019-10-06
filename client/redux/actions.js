import getClient from '../io-client';
import * as Events from '../../server/events.mjs';

export const UrlChanged = 'UrlChanged';
export const SetInputFormDisabled = 'SetInputFormDisabled';
export const ClearInputForm = 'ClearInputForm';
export const QueueUpdated = 'QueueUpdated';
export const TaskStatusChanged = 'TaskStatusChanged';
export const SetSelectedTaskId = 'SetSelectedTaskId';

export const selectTask = ({ id }) => ({
  type: SetSelectedTaskId,
  id,
});

export const setInputFormDisabled = disabled => ({
  type: SetInputFormDisabled,
  disabled,
});

export const clearInputForm = () => ({ type: ClearInputForm });

export const changeURL = url => {
  let error;
  if (url) {
    try {
      new URL(url);
    } catch(err) {
      error = err;
    }
  }

  return {
    error,
    type: UrlChanged,
    url,
  };
}

export const submitTask = url => {
  // setInputFormDisabled(true);
  getClient().emit(Events.TaskAdded, { url });
  
  return clearInputForm();;
}

export const updateQueue = queue => ({
  type: QueueUpdated,
  queue,
});
