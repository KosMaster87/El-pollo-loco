/**
 * @fileoverview Small chick enemy class.
 * @description Manages small chick enemies with walking and death animations.
 * @module models/enemy-chick-class
 */

"use strict";

/**
 * Small chick enemy class.
 * @class
 * @extends {MovableObject}
 */
class Chick extends MovableObject {
  IMAGES_WALKING = [
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["./assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  y = 400;
  height = 45;
  width = 45;
  energy = 100;

  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  /**
   * Creates an instance of Chick.
   * Initializes image loading, sets random speed and position, and starts animation.
   */
  constructor() {
    super().loadImage("./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.images = {};
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.15 + Math.random() * 0.25;
    this.x = 1000 + Math.random() * 10000;
    this.animate();
  }

  /**
   * Starts the movement and animation intervals for the Chick.
   * @returns {void}
   */
  animate() {
    this.walkingInterval = setStoppableInterval(() => this.moveLeft(), 1000 / 60);
    this.animationInterval = setStoppableInterval(
      () => this.playAnimation(this.IMAGES_WALKING),
      1000 / 7
    );
  }

  /**
   * Handles the logic for hitting an opponent.
   * Sets the energy to 0 and initiates the death sequence.
   * @returns {void}
   */
  hitOpponent() {
    this.energy = 0;
    this.die();
  }

  /**
   * Handles the death sequence for the Chick.
   * Plays the death animation, stops intervals, and removes the Chick from the enemies array.
   * @returns {void}
   */
  die() {
    this.audioManager.playSound("opponentDeath");
    clearInterval(this.walkingInterval);
    clearInterval(this.animationInterval);
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      this.world.level.enemies = this.world.level.enemies.filter((enemy) => enemy !== this);
    }, 700);
  }
}
