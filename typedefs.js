/**
 * @typedef Task
 * @property {string} id -
 * @property {string} url -
 * @property {Status} status -
 * @property {Date} added -
 * @property {Date} finished -
 */

/**
 * @typedef InputFormState
 * @property {string} url -
 * @property {boolean} disabled -
 * @property {string} errorMessage - blank if no errors encountered
 */

/**
 * @typedef AppState
 * @property {Tasks[]} tasks -
 * @property {InputFormState} inputForm -
 */

/**
 * @typedef SocketIO
 * @property {function} on -
 * @property {function} emit -
 */
