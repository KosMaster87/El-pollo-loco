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
}

/**
 * Second step to initiate the Game script.
 */
function startGame() {
  if (isGameRunning) {
    resetGlobals();
  }

  document.getElementById("menuPop").style.display = "none";
  isGameRunning = true;
  gameStartetOnce = true;
  checkWidth();

  audioManager.stopSound("inHomeMusic");
  audioManager.playSound("inGameMusic");
}

function returnToHome() {
  resetGlobals();
  clearAllIntervals();
  document.getElementById("menuPop").style.display = "none";
  resetCanvas();
}

function gameOver() {
  resetGlobals();
  clearAllIntervals();
  apertureGameOver();
  resetCanvas();
  audioManager.stopSound("inGameMusic");
  setTimeout(() => {
    audioManager.playSound("inHomeMusic");
  }, 700);
}

/**
 * Bildblende gameOver
 */
function apertureGameOver() {
  document.getElementById("apertureGameOver").classList.remove("hidden");
  document.getElementById("apertureGameOver").classList.add("visible");

  setTimeout(() => {
    document.getElementById("apertureGameOver").classList.remove("visible");
    document.getElementById("apertureGameOver").classList.add("hidden");
    document.getElementById("menuPop").style.display = "flex";
  }, 3000);
}

function resetCanvas() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
