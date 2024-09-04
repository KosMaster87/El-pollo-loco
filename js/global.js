"use strict";

let intervalIds = [];
let timeoutIds = [];
let pausedIntervals = [];
let pausedTimeoutIds = [];

/**
 * Starts a new interval and saves the interval ID.
 */
function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push({ id, fn, time });
  return id;
}

/**
 * Starts a new timeout and saves the timeout ID.
 */
function setStoppableTimeout(fn, time) {
  let id = setTimeout(() => {
    fn();
  }, time);
  timeoutIds.push({ id, fn, time });
  return id;
}

/**
 * Pauses all running intervals.
 */
function pauseAllIntervals() {
  intervalIds.forEach((interval) => {
    clearInterval(interval.id);
    pausedIntervals.push(interval);
  });
  intervalIds = [];
}

/**
 * Pauses all running timeouts.
 */
function pauseAllTimeouts() {
  timeoutIds.forEach((timeout) => {
    clearTimeout(timeout.id);
    pausedTimeoutIds.push(timeout);
  });
  timeoutIds = [];
}

/**
 * Resumes all paused intervals.
 */
function resumeAllIntervals() {
  pausedIntervals.forEach((interval) => {
    let id = setInterval(interval.fn, interval.time);
    intervalIds.push({ id, fn: interval.fn, time: interval.time });
  });
  pausedIntervals = [];
}

/**
 * Resumes all paused timeouts.
 */
function resumeAllTimeouts() {
  pausedTimeoutIds.forEach((timeout) => {
    let id = setTimeout(timeout.fn, timeout.time);
    timeoutIds.push({ id, fn: timeout.fn, time: timeout.time });
  });
  pausedTimeoutIds = [];
}

/**
 * Clears all running intervals and timeouts.
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
 * Resets global variables.
 */
function resetGlobals() {
  isGameRunning = false;
  gameStartetOnce = false;
  world = null;
}
