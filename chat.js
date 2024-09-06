"use strict";

let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let staticInstance = new Static();
let isGameRunning = false;
let gameStartetOnce = false;

/**
 * First step to instruct to prepare to play.
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

  if (isLandscapeOrientation()) {
    enterFullscreen(document.getElementById("mainLayerAsRelative"));
  }
}

/**
 * Second step to initiate the Game script.
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

// ... der Rest des Codes bleibt unverändert

/**
 * Triggert den Vollbildmodus an sich; damit auch die Taste F11 fokussiert wird.
 * Triggers the full screen mode itself; so that the F11 key is also focused.
 */
document.addEventListener("fullscreenchange", () => {
  adjustDisplayBasedOnWidthAndOrientation();
  if (!document.fullscreenElement) {
    resetCanvas();
  }
  resumeAllIntervals();
  resumeAllTimeouts();
});
