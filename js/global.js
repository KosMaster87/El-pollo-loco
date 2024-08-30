"use strict";

let intervalIds = [];
let timeoutIds = [];
let pausedIntervals = [];
let pausedTimeoutIds = [];

/**
 * Startet ein neues Intervall und speichert die Intervall-ID.
 */
function setStoppableInterval(fn, time) {
  let id = setInterval(fn, time);
  intervalIds.push({ id, fn, time });
  // console.log("Aktuelle Intervalle:", intervalIds);
  return id;
}

/**
 * Startet ein neues Timeout und speichert die Timeout-ID.
 */
function setStoppableTimeout(fn, time) {
  let id = setTimeout(() => {
    fn();
  }, time);
  timeoutIds.push({ id, fn, time });
  console.log("Aktuelle Timeouts:", timeoutIds);
  return id;
}

/**
 * Pausiert alle laufenden Intervalle.
 */
function pauseAllIntervals() {
  intervalIds.forEach((interval) => {
    clearInterval(interval.id);
    pausedIntervals.push(interval);
  });
  intervalIds = [];
  // console.log("Pausiere Intervalle:", pausedIntervals);
}

/**
 * Pausiert alle laufenden Timeouts.
 */
function pauseAllTimeouts() {
  timeoutIds.forEach((timeout) => {
    clearTimeout(timeout.id);
    pausedTimeoutIds.push(timeout);
  });
  timeoutIds = [];
  console.log("Pausiere Timeouts:", pausedTimeoutIds);
}

/**
 * Setzt alle pausierten Intervalle fort.
 */
function resumeAllIntervals() {
  pausedIntervals.forEach((interval) => {
    let id = setInterval(interval.fn, interval.time);
    intervalIds.push({ id, fn: interval.fn, time: interval.time });
  });
  pausedIntervals = [];
  // console.log("Resume Intervalle:", intervalIds);
}

/**
 * Setzt alle pausierten Timeouts fort.
 */
function resumeAllTimeouts() {
  pausedTimeoutIds.forEach((timeout) => {
    let id = setTimeout(timeout.fn, timeout.time);
    timeoutIds.push({ id, fn: timeout.fn, time: timeout.time });
  });
  pausedTimeoutIds = [];
  console.log("Resume Timeouts:", timeoutIds);
}

/**
 * Löscht alle laufenden Intervalle und Timeouts.
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
 * Setzt globale Variablen zurück.
 */
function resetGlobals() {
  isGameRunning = false;
  world = null;
}
