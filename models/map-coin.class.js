/**
 * @fileoverview Collectible coin implementation.
 * @description Manages animated coin objects that can be collected by the player for points.
 * @module models/map-coin-class
 */

"use strict";

/**
 * Collectible coin class with spinning animation.
 * @class
 * @extends {MovableObject}
 */
class Coin extends MovableObject {
  IMAGES_COIN = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];

  offset = { top: 35, bottom: 35, left: 35, right: 35 };
  width = 100;
  height = 100;
  x = 0;
  y = 0;

  /**
   * Creates coin instance with initial position at origin.
   * Position will be set by level generator.
   */
  constructor() {
    super().loadImage("./img/8_coin/coin_1.png");
    this.images = {};
    this.loadImages(this.IMAGES_COIN);
    this.animate();
  }

  /**
   * Starts coin spinning animation loop.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(() => this.playAnimation(this.IMAGES_COIN), 220);
  }
}
