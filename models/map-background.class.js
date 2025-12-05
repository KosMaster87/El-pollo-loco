/**
 * @fileoverview Background object class.
 * @description Manages static background objects for the game level.
 * @module models/map-background-class
 */

"use strict";

/**
 * Background object class for level backgrounds.
 * @class
 * @extends {MovableObject}
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;
  parallaxSpeed = 1;

  /**
   * Creates an instance of a background object.
   * @param {string} imagePath - The path to the image file used for the background object.
   * @param {number} x - The x-coordinate position of the background object.
   * @param {number} [parallaxSpeed=1] - Parallax speed multiplier (0-1 for slower, >1 for faster).
   */
  constructor(imagePath, x, parallaxSpeed = 1) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
    this.parallaxSpeed = parallaxSpeed;
  }
}
