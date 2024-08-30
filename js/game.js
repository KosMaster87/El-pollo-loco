"use strict";

let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
let isGameRunning = false;
let staticInstance = new Static();

/**
 * First step to instruct to prepare to play.
 */
function initGame() {
  canvas = document.getElementById("canvas");
  startGame();
  initLevel();
  world = new World(canvas, keyboard, audioManager, staticInstance);
}

/**
 * Second step to initiate the Game script.
 */
function startGame() {
  document.getElementById("menuPop").style.display = "none";
  isGameRunning = true;
  checkWidth();

  audioManager.stopSound("inHomeMusic");
  audioManager.playSound("inGameMusic");
}

function returnToHome() {
  isGameRunning = false;
  resetGlobals();
  clearAllIntervals();
  document.getElementById("menuPop").style.display = "none";
  resetCanvas();
}

function gameOver() {
  isGameRunning = false;
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
