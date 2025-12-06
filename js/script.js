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
 * Opens the in-game menu and pauses the game, stopping all intervals and timeouts.
 * Switches music from in-game to home screen.
 */
function openMenu() {
  if (isGameRunning) {
    pauseAllIntervals();
    pauseAllTimeouts();
    audioManager.stopSound("inGameMusic");
    isGameRunning = false;
  }

  menuPopRef.style.display = "flex";
  mobileControlHubRef.style.display = "none";
  audioManager.playSound("inHomeMusic");
}

/**
 * Closes the in-game menu and resumes the game if it was running previously.
 * Switches music from home screen to in-game.
 */
function closeMenu() {
  const w3IncludeRef = document.getElementById("w3_include");
  w3IncludeRef.style.display = "none";

  menuPopRef.style.display = "none";
  if (!isGameRunning && gameStartetOnce) {
    resumeAllIntervals();
    resumeAllTimeouts();
    audioManager.stopSound("inHomeMusic");
    audioManager.playSound("inGameMusic");
    isGameRunning = true;
  } else if (isGameRunning && w3_includeRef) {
    w3_includeRef.style.display = "none";
  }
  startGame();
}

/**
 * Adds an event listener to close the menu if a click occurs outside the menu popup.
 *
 * @param {HTMLElement} menuPopRef - Reference to the menu popup element.
 * @param {HTMLElement} openMenuBtn - Reference to the open menu button.
 * @param {function} closeMenu - Function to close the menu.
 */
function alsoClickOutside(menuPopRef, openMenuBtn, closeMenu) {
  function userClicksOutsideOfPopup(event) {
    return !menuPopRef.contains(event.target) && event.target !== openMenuBtn;
  }

  document.addEventListener("click", function (event) {
    if (
      menuPopRef.style.display === "flex" &&
      userClicksOutsideOfPopup(event)
    ) {
      returnToHome();
    }
  });
}

/**
 * Toggles full screen mode on and off.
 * If the game is over, it resets the game canvas.
 * Closes the menu and resumes game if menu was open.
 *
 * @param {Event} event - The event triggered by the full screen toggle.
 */
function toggleFullscreen(event) {
  event.preventDefault();

  if (gameOver) {
    resetCanvas();
  }

  if (menuPopRef.style.display === "flex") {
    closeMenu();
  }

  const mainLayer = document.getElementById("mainLayerAsRelative");
  if (!document.fullscreenElement) {
    enterFullscreen(mainLayer);
  } else {
    exitFullscreen();
  }
}

/**
 * Enters full screen mode for the provided element.
 *
 * @param {HTMLElement} element - The element to display in full screen mode.
 */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }

  document.getElementById("menuPop").style.display = "none";
  adjustDisplayBasedOnWidthAndOrientation();
}

/**
 * Exits full screen mode.
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }

  document.getElementById("menuPop").style.display = "none";
  adjustDisplayBasedOnWidthAndOrientation();
}

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
 * Checks if the current device is in landscape orientation.
 *
 * @returns {boolean} - True if the device is in landscape orientation, otherwise false.
 */
function isLandscapeOrientation() {
  return window.matchMedia("(orientation: landscape)").matches;
}

/**
 * Returns the current width of the browser window.
 *
 * @returns {number} - The width of the window in pixels.
 */
function getScreenWidth() {
  return window.innerWidth;
}

/**
 * Adjusts display elements based on the width and orientation of the device.
 */
function adjustDisplayBasedOnWidthAndOrientation() {
  const rotateLayerRef = document.getElementById("rotateLayer");
  const mobileControlHubRef = document.getElementById("mobileControlHub");
  const width = getScreenWidth();
  const isLandscape = isLandscapeOrientation();

  if (isLandscape) {
    handleLandscapeMode(width, rotateLayerRef, mobileControlHubRef);
  } else {
    handlePortraitMode(width, rotateLayerRef, mobileControlHubRef);
  }
}

/**
 * Handles the display of elements when the device is in landscape mode.
 *
 * @param {number} width - The width of the screen in pixels.
 * @param {HTMLElement} rotateLayerRef - Reference to the rotate layer element.
 * @param {HTMLElement} mobileControlHubRef - Reference to the mobile control hub element.
 */
function handleLandscapeMode(width, rotateLayerRef, mobileControlHubRef) {
  if (width <= 667 || (width >= 668 && width <= 1080)) {
    rotateLayerRef.style.display = "none";
    mobileControlHubRef.style.display = gameStartetOnce ? "flex" : "none";
  } else if (width <= 1368) {
    rotateLayerRef.style.display = "none";
    mobileControlHubRef.style.display = "flex";
  } else {
    rotateLayerRef.style.display = "none";
    mobileControlHubRef.style.display = "none";
  }
}

/**
 * Handles the display of elements when the device is in portrait mode.
 *
 * @param {number} width - The width of the screen in pixels.
 * @param {HTMLElement} rotateLayerRef - Reference to the rotate layer element.
 * @param {HTMLElement} mobileControlHubRef - Reference to the mobile control hub element.
 */
function handlePortraitMode(width, rotateLayerRef, mobileControlHubRef) {
  if (width >= 667) {
    rotateLayerRef.style.display = "none";
    mobileControlHubRef.style.display = "none";
  } else {
    rotateLayerRef.style.display = "flex";
    mobileControlHubRef.style.display = "none";
  }
}

/**
 * Adds event listeners that adjust the display when the window is resized
 * or when the document is loaded.
 */
window.addEventListener("resize", () =>
  adjustDisplayBasedOnWidthAndOrientation()
);
document.addEventListener("DOMContentLoaded", () =>
  adjustDisplayBasedOnWidthAndOrientation()
);

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
