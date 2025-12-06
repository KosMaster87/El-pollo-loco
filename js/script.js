/**
 * @fileoverview Main game UI and menu control script.
 * @description Handles menu interactions, fullscreen mode, and display adjustments for the game.
 * @module js/script
 */

"use strict";

let openMenuBtn, menuPopRef, mobileControlHubRef;

/**
 * Event listener to show or hide the menu after the DOM is fully loaded.
 * Initializes the open menu button, menu popup, and mobile control hub references.
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function () {
  openMenuBtn = document.getElementById("openMenuBtn");
  menuPopRef = document.getElementById("menuPop");
  mobileControlHubRef = document.getElementById("mobileControlHub");
  openMenuBtn.addEventListener("click", openMenu);
  alsoClickOutside(menuPopRef, openMenuBtn, closeMenu);
});

/**
 * Pauses game and stops music.
 * @returns {void}
 */
const pauseGameState = () => {
  pauseAllIntervals();
  pauseAllTimeouts();
  audioManager.stopSound("inGameMusic");
  isGameRunning = false;
};

/**
 * Opens in-game menu and pauses gameplay.
 * @returns {void}
 */
const openMenu = () => {
  if (isGameRunning) pauseGameState();

  menuPopRef.style.display = "flex";
  mobileControlHubRef.style.display = "none";
  audioManager.playSound("inHomeMusic");

  if (document.activeElement) document.activeElement.blur();
};

/**
 * Resumes game state and switches music.
 * @returns {void}
 */
const resumeGameState = () => {
  resumeAllIntervals();
  resumeAllTimeouts();
  audioManager.stopSound("inHomeMusic");
  audioManager.playSound("inGameMusic");
  isGameRunning = true;
};

/**
 * Closes in-game menu and resumes gameplay.
 * @returns {void}
 */
const closeMenu = () => {
  const w3IncludeRef = document.getElementById("w3_include");
  w3IncludeRef.style.display = "none";
  menuPopRef.style.display = "none";

  if (!isGameRunning && gameStartetOnce) {
    resumeGameState();
  } else if (isGameRunning && w3IncludeRef) {
    w3IncludeRef.style.display = "none";
  }
  startGame();
};

/**
 * Checks if click is outside popup area.
 * @param {Event} event - Click event
 * @returns {boolean} - True if outside
 */
const isClickOutsidePopup = (event) => {
  return !menuPopRef.contains(event.target) && event.target !== openMenuBtn;
};

/**
 * Adds click listener to close menu when clicking outside.
 * @param {HTMLElement} menuPopRef - Menu popup reference
 * @param {HTMLElement} openMenuBtn - Open menu button reference
 * @param {Function} closeMenu - Close menu function
 * @returns {void}
 */
const alsoClickOutside = (menuPopRef, openMenuBtn, closeMenu) => {
  document.addEventListener("click", (event) => {
    if (menuPopRef.style.display === "flex" && isClickOutsidePopup(event)) {
      returnToHome();
    }
  });
};

/**
 * Toggles fullscreen mode on/off.
 * @param {Event} event - Click event
 * @returns {void}
 */
const toggleFullscreen = (event) => {
  event.preventDefault();

  if (gameOver) resetCanvas();
  if (menuPopRef.style.display === "flex") closeMenu();

  toggleFullscreenForElement();
  document.getElementById("menuPop").style.display = "none";
  adjustDisplayBasedOnWidthAndOrientation();

  if (event.currentTarget) event.currentTarget.blur();
};

/**
 * Event listener triggered when the full screen mode changes.
 * Adjusts the display based on the current screen width and orientation.
 */
document.addEventListener("fullscreenchange", () => {
  adjustDisplayBasedOnWidthAndOrientation();
  if (!document.fullscreenElement) {
    resetCanvas();
  }
  resumeAllIntervals();
  resumeAllTimeouts();
});

/**
 * Prepares the gaming experience by starting a loading spinner and preloading assets.
 */
async function prepareTheGamingExperience() {
  await loadingSpinnerStart();
  await preloadAssets();
  loadingSpinnerEnd();
}

/**
 * Starts the loading spinner by displaying the loading spinner layer.
 */
async function loadingSpinnerStart() {
  adjustDisplayBasedOnWidthAndOrientation();
  const loadingSpinnerLayerRef = document.getElementById("loadingSpinnerLayer");
  loadingSpinnerLayerRef.style.display = "flex";
}

/**
 * Ends the loading spinner by hiding the loading spinner layer.
 */
function loadingSpinnerEnd() {
  const loadingSpinnerLayerRef = document.getElementById("loadingSpinnerLayer");
  loadingSpinnerLayerRef.style.display = "none";
}
