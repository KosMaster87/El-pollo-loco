"use strict";

let alpha = 0; // Startwert der Transparenz (0 = komplett unsichtbar)
let fadeDirection = 1; // 1 für Einblenden, -1 für Ausblenden
let animationId;

const imageSources = [
  "./img/9_intro_outro_screens/start/startscreen_1.png",
  "./img/9_intro_outro_screens/game_over/game over!.png",
  "./img/8_coin/coin_2.png",
];

function changeBackgroundImage(index) {
  cancelAnimation(); // Beende vorherige Animation, falls vorhanden
  resetAnimation(); // Setze Animationseinstellungen zurück

  const imageSrc = imageSources[index];
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = imageSrc;

  img.onload = function () {
    animateImage(ctx, img, canvas);
  };
}

function animateImage(ctx, img, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  applyBackgroundBlur(ctx, canvas);

  ctx.globalAlpha = alpha;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  alpha += 0.01 * fadeDirection;

  if (alpha >= 1) {
    fadeDirection = 0;
    setTimeout(() => {
      fadeDirection = -1;
    }, 2000);
  }

  if (alpha <= 0) {
    cancelAnimationFrame(animationId);
    ctx.globalAlpha = 1;
    return;
  }

  animationId = requestAnimationFrame(() => animateImage(ctx, img, canvas));
}

/**
 * Erstelle einen separaten Blur-Effekt für den gesamten Canvas
 */
function applyBackgroundBlur(ctx, canvas) {
  ctx.save();
  ctx.filter = "blur(10px)";
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function resetAnimation() {
  alpha = 0;
  fadeDirection = 1;
}

function cancelAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// /**
//  * Spielstopp vorbei! - background löschen und initGame/startGame.
//  */
// function clearCanvas() {
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.globalAlpha = 1;
// }

// /**
//  * Das Pause Button machen?!
//  */
// function togglePause() {
//   isPaused = !isPaused;
//   if (isPaused) {
//     openMenu();
//     // drawPauseText();
//   } else {
//     clearCanvas();
//   }
// }

/**
 * Belibigen Text in der Canvas schreiben.
 */
// function drawPauseText() {
//   const canvas = document.getElementById("canvas");
//   const ctx = canvas.getContext("2d");
//   ctx.font = "48px serif";
//   ctx.fillStyle = "white";
//   ctx.fillText("Game Paused", canvas.width / 2 - 100, canvas.height / 2);
// }
