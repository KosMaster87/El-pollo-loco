/**
 * @fileoverview Collectible bottle implementation.
 * @description Manages animated bottle objects that can be collected and thrown by the player.
 * @module models/map-bottle-class
 */

"use strict";

/**
 * Collectible bottle class with animation.
 * @class
 * @extends {PickableObject}
 */
class Bottle extends PickableObject {
  IMAGES_SALSA_GROUND = [
    "./assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  offset = { top: 10, bottom: 10, left: 10, right: 10 };
  width = 50;
  height = 60;

  /**
   * Creates bottle instance with optional position.
   * @param {number} [x=0] - X-coordinate position
   * @param {number} [y=0] - Y-coordinate position
   */
  constructor(x, y) {
    super().loadImage("./assets/img/6_salsa_bottle/salsa_bottle.png");
    this.images = {};
    this.loadImages(this.IMAGES_SALSA_GROUND);
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
    this.animate();
  }

  /**
   * Starts bottle animation loop.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(() => this.playAnimation(this.IMAGES_SALSA_GROUND), 220);
  }
}
