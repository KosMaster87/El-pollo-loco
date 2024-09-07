"use strict";

let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let staticInstance = new Static();
let isGameRunning = false;
let gameStartetOnce = false;

/**
 * Initializes the game by setting up the canvas, starting the game,
 * initializing the level, and creating a new World instance.
 */
function initGame() {
  canvas = document.getElementById("canvas");

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
 * Starts the game by resetting global states if necessary, hides
 * menus, adjusts the display, and plays the in-game music.
 */
function startGame() {
  if (isGameRunning) {
    resetGlobals();
  }

  isGameRunning = true;
  gameStartetOnce = true;
  document.getElementById("w3_include").style.display = "none";
  document.getElementById("menuPop").style.display = "none";
  document.getElementById("homeLayer").style.display = "none";
  adjustDisplayBasedOnWidthAndOrientation();
  audioManager.stopSound("inHomeMusic");
  audioManager.playSound("inGameMusic");
}

/**
 * Returns to the home screen by resetting global states, clearing
 * intervals, resetting the canvas, and showing the home layer.
 */
function returnToHome() {
  document.getElementById("w3_include").style.display = "none";
  document.getElementById("menuPop").style.display = "none";
  document.getElementById("homeLayer").style.display = "block";

  resetGlobals();
  clearAllIntervals();
  resetCanvas();
}

/**
 * Handles the game over scenario by resetting global states,
 * clearing intervals, showing the game over screen, and playing
 * the appropriate sounds.
 */
function gameOver() {
  resetGlobals();
  clearAllIntervals();
  apertureGameOver();
  resetCanvas();
  audioManager.stopSound("inGameMusic");
  setTimeout(() => {
    audioManager.playSound("inHomeMusic");
  }, 1500);
  adjustDisplayBasedOnWidthAndOrientation();
}

/**
 * Handles the game win scenario by resetting global states,
 * clearing intervals, showing the game win screen, and playing
 * the appropriate sounds.
 */
function gameWin() {
  resetGlobals();
  clearAllIntervals();
  apertureGameWin();
  resetCanvas();
  audioManager.stopSound("inGameMusic");
  setTimeout(() => {
    audioManager.playSound("inHomeMusic");
  }, 1500);
  adjustDisplayBasedOnWidthAndOrientation();
}

/**
 * Displays the game over aperture animation and hides it after
 * a timeout, then shows the game menu.
 */
function apertureGameOver() {
  document.getElementById("apertureGameOver").classList.remove("hidden");
  document.getElementById("apertureGameOver").classList.add("visible");

  setTimeout(() => {
    document.getElementById("apertureGameOver").classList.remove("visible");
    document.getElementById("apertureGameOver").classList.add("hidden");
    document.getElementById("menuPop").style.display = "flex";
  }, 3000);
  document.getElementById("homeLayer").style.display = "block";
}

/**
 * Displays the game win aperture animation and hides it after
 * a timeout, then shows the game menu.
 */
function apertureGameWin() {
  document.getElementById("apertureGameWin").classList.remove("hidden");
  document.getElementById("apertureGameWin").classList.add("visible");

  setTimeout(() => {
    document.getElementById("apertureGameWin").classList.remove("visible");
    document.getElementById("apertureGameWin").classList.add("hidden");
    document.getElementById("menuPop").style.display = "flex";
  }, 3000);
  document.getElementById("homeLayer").style.display = "block";
}

/**
 * Resets the canvas by clearing its entire content.
 */
function resetCanvas() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
