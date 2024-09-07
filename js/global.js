"use strict";

let intervalIds = [];
let timeoutIds = [];
let pausedIntervals = [];
let pausedTimeoutIds = [];

/**
 * Starts a new interval, executes the given function at the specified interval,
 * and saves the interval ID to allow for stopping or pausing later.
 *
 * @param {Function} fn - The function to execute at each interval.
 * @param {number} time - The interval time in milliseconds.
 * @returns {number} The ID of the interval.
 */
function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push({ id, fn, time });
  return id;
}

/**
 * Starts a new timeout, executes the given function after the specified delay,
 * and saves the timeout ID to allow for stopping or pausing later.
 *
 * @param {Function} fn - The function to execute after the delay.
 * @param {number} time - The delay time in milliseconds.
 * @returns {number} The ID of the timeout.
 */
function setStoppableTimeout(fn, time) {
  let id = setTimeout(() => {
    fn();
  }, time);
  timeoutIds.push({ id, fn, time });
  return id;
}

/**
 * Pauses all currently running intervals by clearing them,
 * and saves them for resuming later.
 */
function pauseAllIntervals() {
  intervalIds.forEach((interval) => {
    clearInterval(interval.id);
    pausedIntervals.push(interval);
  });
  intervalIds = [];
}

/**
 * Pauses all currently running timeouts by clearing them,
 * and saves them for resuming later.
 */
function pauseAllTimeouts() {
  timeoutIds.forEach((timeout) => {
    clearTimeout(timeout.id);
    pausedTimeoutIds.push(timeout);
  });
  timeoutIds = [];
}

/**
 * Resumes all paused intervals by restarting them using their original
 * functions and timings, and re-saves their new IDs.
 */
function resumeAllIntervals() {
  pausedIntervals.forEach((interval) => {
    let id = setInterval(interval.fn, interval.time);
    intervalIds.push({ id, fn: interval.fn, time: interval.time });
  });
  pausedIntervals = [];
}

/**
 * Resumes all paused timeouts by restarting them using their original
 * functions and timings, and re-saves their new IDs.
 */
function resumeAllTimeouts() {
  pausedTimeoutIds.forEach((timeout) => {
    let id = setTimeout(timeout.fn, timeout.time);
    timeoutIds.push({ id, fn: timeout.fn, time: timeout.time });
  });
  pausedTimeoutIds = [];
}

/**
 * Clears all currently running intervals and timeouts, as well as any paused
 * ones, resetting the global interval and timeout arrays.
 */
function clearAllIntervals() {
  intervalIds.forEach(({ id }) => clearInterval(id));
  timeoutIds.forEach(({ id }) => clearTimeout(id));
  pausedIntervals.forEach(({ id }) => clearInterval(id));
  pausedTimeoutIds.forEach(({ id }) => clearTimeout(id));
  intervalIds = [];
  timeoutIds = [];
  pausedIntervals = [];
  pausedTimeoutIds = [];
}

/**
 * Resets global variables related to the game state, including
 * game running status and world instance.
 */
function resetGlobals() {
  isGameRunning = false;
  gameStartetOnce = false;
  world = null;
}
