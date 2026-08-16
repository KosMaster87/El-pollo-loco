/**
 * @fileoverview Fullscreen API and Minimal UI management.
 * @description Handles fullscreen mode for desktop and minimal UI mode for mobile devices.
 * @module js/fullscreen
 */

"use strict";

/**
 * Checks if device is in landscape and not in fullscreen.
 * @returns {boolean} - True if conditions met
 */
const canRequestFullscreen = () => {
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isNotFullscreen = !document.fullscreenElement && !document.webkitFullscreenElement;
  return isMobileDevice() && isLandscape && isNotFullscreen;
};

/**
 * Requests fullscreen mode when game starts using user's click interaction.
 * @returns {void}
 */
const requestFullscreenOnGameStart = () => {
  if (canRequestFullscreen()) {
    requestFullscreen(document.documentElement);
  }
};

/**
 * Gets current fullscreen element.
 * @returns {Element|null} - Current fullscreen element
 */
const getCurrentFullscreenElement = () => {
  return document.fullscreenElement || document.webkitFullscreenElement;
};

/**
 * Handles toggle from no fullscreen to canvas fullscreen.
 * @param {HTMLElement} mainLayer - Main layer element
 * @returns {void}
 */
const enterCanvasFullscreen = (mainLayer) => {
  requestFullscreen(mainLayer);
};

/**
 * Handles toggle from minimal UI to canvas fullscreen.
 * @param {HTMLElement} mainLayer - Main layer element
 * @returns {void}
 */
const switchToCanvasFullscreen = (mainLayer) => {
  exitFullscreen();
  setTimeout(() => requestFullscreen(mainLayer), 100);
};

/**
 * Handles toggle from canvas fullscreen to minimal UI or exit.
 * @returns {void}
 */
const exitOrSwitchToMinimalUI = () => {
  exitFullscreen();
  if (isMobileDevice() && isGameRunning) {
    setTimeout(() => requestFullscreen(document.documentElement), 100);
  }
};

/**
 * Toggles fullscreen mode between states.
 * @returns {void}
 */
const toggleFullscreenForElement = () => {
  const mainLayer = document.getElementById("mainLayerAsRelative");
  const currentElement = getCurrentFullscreenElement();

  if (!currentElement) {
    enterCanvasFullscreen(mainLayer);
  } else if (currentElement === document.documentElement) {
    switchToCanvasFullscreen(mainLayer);
  } else {
    exitOrSwitchToMinimalUI();
  }
};

/**
 * Requests fullscreen for element with browser compatibility.
 * @param {HTMLElement} element - Element to make fullscreen
 * @returns {void}
 */
const requestFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen().catch(() => {});
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};

/**
 * Exits fullscreen mode with browser compatibility.
 * @returns {void}
 */
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};
