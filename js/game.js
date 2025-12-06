/**
 * @fileoverview Core game initialization and lifecycle management.
 * @description Manages game start, stop, reset, and game over/win scenarios.
 * @module js/game
 */

"use strict";

let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let staticInstance = new Static();
let isGameRunning = false;
let gameStartetOnce = false;
let gameEnded = false;

/**
 * Initializes the game by setting up the canvas, starting the game,
 * initializing the level, and creating a new World instance.
 * @returns {void}
 */
function initGame() {
  canvas = document.getElementById("canvas");
  setCanvasSize();

  startGame();
  initLevel();
  world = new World(
    canvas,
    keyboard,
    audioManager,
    staticInstance,
    isGameRunning
  );
}

/**
 * Sets the canvas internal resolution based on its CSS display size.
 * Uses fixed 16:9 resolution (720x480) for consistent game rendering.
 * @returns {void}
 */
function setCanvasSize() {
  canvas.width = 720;
  canvas.height = 480;
}

/**
 * Hides UI elements for game start.
 * @returns {void}
 */
const hideUIElements = () => {
  document.getElementById("w3_include").style.display = "none";
  document.getElementById("menuPop").style.display = "none";
  document.getElementById("homeLayer").style.display = "none";
};

/**
 * Switches audio from home to game music.
 * @returns {void}
 */
const switchToGameMusic = () => {
  audioManager.stopSound("inHomeMusic");
  audioManager.playSound("inGameMusic");
};

/**
 * Starts the game by resetting states and initializing gameplay.
 * @returns {void}
 */
const startGame = () => {
  if (isGameRunning) resetGlobals();

  isGameRunning = true;
  gameStartetOnce = true;
  gameEnded = false;
  hideUIElements();
  adjustDisplayBasedOnWidthAndOrientation();
  switchToGameMusic();
  requestFullscreenOnGameStart();
};

/**
 * Shows home screen UI elements.
 * @returns {void}
 */
const showHomeScreen = () => {
  document.getElementById("w3_include").style.display = "none";
  document.getElementById("menuPop").style.display = "none";
  document.getElementById("homeLayer").style.display = "block";
};

/**
 * Returns to home screen by resetting state and showing UI.
 * @returns {void}
 */
const returnToHome = () => {
  showHomeScreen();
  resetGlobals();
  clearAllIntervals();
  resetCanvas();
};

/**
 * Hides desktop prompts.
 * @returns {void}
 */
const hideDesktopPrompts = () => {
  const healPrompt = document.getElementById("healPromptDesktop");
  const throwPrompt = document.getElementById("throwPromptDesktop");
  if (healPrompt) healPrompt.style.display = "none";
  if (throwPrompt) throwPrompt.style.display = "none";
};

/**
 * Switches from game music to home music with delay.
 * @returns {void}
 */
const switchToHomeMusic = () => {
  audioManager.stopSound("inGameMusic");
  setTimeout(() => audioManager.playSound("inHomeMusic"), 1500);
};

/**
 * Handles game over scenario.
 * @returns {void}
 */
const gameOver = () => {
  resetGlobals();
  clearAllIntervals();
  apertureGameOver();
  resetCanvas();
  hideDesktopPrompts();
  switchToHomeMusic();
  adjustDisplayBasedOnWidthAndOrientation();
};

/**
 * Handles game win scenario.
 * @returns {void}
 */
const gameWin = () => {
  resetGlobals();
  clearAllIntervals();
  apertureGameWin();
  resetCanvas();
  hideDesktopPrompts();
  switchToHomeMusic();
  adjustDisplayBasedOnWidthAndOrientation();
};

/**
 * Shows aperture with fade in/out animation.
 * @param {string} apertureId - ID of aperture element
 * @returns {void}
 */
const showAperture = (apertureId) => {
  const aperture = document.getElementById(apertureId);
  aperture.classList.remove("hidden");
  aperture.classList.add("visible");

  setTimeout(() => {
    aperture.classList.remove("visible");
    aperture.classList.add("hidden");
    document.getElementById("menuPop").style.display = "flex";
  }, 3000);
  document.getElementById("homeLayer").style.display = "block";
};

/**
 * Displays game over aperture animation.
 * @returns {void}
 */
const apertureGameOver = () => showAperture("apertureGameOver");

/**
 * Displays game win aperture animation.
 * @returns {void}
 */
const apertureGameWin = () => showAperture("apertureGameWin");

/**
 * Checks if home screen should be shown.
 * @returns {boolean} - True if should show home
 */
const shouldShowHomeScreen = () => !isGameRunning || gameEnded;

/**
 * Resets canvas by clearing content and showing home screen if needed.
 * @returns {void}
 */
const resetCanvas = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const homeLayer = document.getElementById("homeLayer");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (homeLayer && shouldShowHomeScreen()) {
    homeLayer.style.display = "block";
  }
};
