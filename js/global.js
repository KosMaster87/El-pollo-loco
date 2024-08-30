"use strict";

let intervalIds = [];
let timeoutIds = [];
let pausedIntervals = [];

/**
 * Startet ein neues Intervall und speichert die Intervall-ID.
 */
function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push({ id, fn, time });
  return id;
}

/**
 * Startet ein neues Timeout und speichert die Timeout-ID.
 */
function setStoppableTimeout(fn, time) {
  let id = setTimeout(() => {
    fn();
    timeoutIds = timeoutIds.filter((timeoutId) => timeoutId !== id);
  }, time);
  timeoutIds.push(id);
  return id;
}

/**
 * It means Pause the game.
 */
function pauseAllIntervals() {
  intervalIds.forEach((interval) => {
    clearInterval(interval.id);
    pausedIntervals.push(interval);
  });
  // console.log("Pausiere Intervalle:", intervalIds);
  intervalIds = [];

  timeoutIds.forEach((id) => {
    clearTimeout(id);
    pausedIntervals.push({ id });
  });
  // console.log("Pausiere Timeouts:", timeoutIds);
  timeoutIds = [];
}

/**
 * It means resume the game.
 */
function resumeAllIntervals() {
  pausedIntervals.forEach((item) => {
    if (item.fn && item.time) {
      let intervalId = setInterval(item.fn, item.time);
      intervalIds.push({ id: intervalId, time: item.time, fn: item.fn });
    } else if (item.fn) {
      setTimeout(item.fn, 0);
    }
  });
  pausedIntervals = [];
}

/**
 * Löscht alle laufenden Intervalle.
 */
function clearAllIntervals() {
  intervalIds.forEach(({ id }) => clearInterval(id));
  timeoutIds.forEach(({ id }) => clearTimeout(id));
  pausedIntervals.forEach(({ id }) => clearInterval(id));
  intervalIds = [];
  timeoutIds = [];
  pausedIntervals = [];
}

/**
 *
 */
function resetGlobals() {
  isGameRunning = false;
  world = null;
}
