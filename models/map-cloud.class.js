/**
 * @fileoverview Cloud class for background clouds.
 * @description Manages animated cloud objects in the background.
 * @module models/map-cloud-class
 */

"use strict";

/**
 * Cloud class for background clouds.
 * @class
 * @extends {MovableObject}
 */
class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 300;

  IMAGES_CLAUD = [
    "./assets/img/5_background/layers/4_clouds/1.png",
    "./assets/img/5_background/layers/4_clouds/2.png",
    "./assets/img/5_background/layers/4_clouds/1.png",
    "./assets/img/5_background/layers/4_clouds/2.png",
  ];

  /**
   * Creates an instance of a cloud.
   */
  constructor() {
    super().loadImage("./assets/img/5_background/layers/4_clouds/1.png");
    this.images = {};
    this.loadImages(this.IMAGES_CLAUD);
    this.x = Math.random() * 10000;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Animates the cloud by moving it to the left.
   * Adjusts the speed and direction of the cloud's movement.
   * @returns {void}
   */
  animate() {
    setStoppableInterval(() => this.moveLeft(), 1000 / 60);
  }
}
