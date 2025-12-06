/**
 * @fileoverview Throwable object class for bottles.
 * @description Manages throwable bottle objects with physics, rotation, and splash animations.
 * @module models/object-throwable
 */

"use strict";

/**
 * Throwable object class for bottles that can be thrown.
 * @class
 * @extends {MovableObject}
 */
class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    "./assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  width = 50;
  height = 60;
  collide = false;
  groundY = 370;
  throwIntervalId;
  rotateIntervalId;
  splashIntervalId;
  splashStarted = false;
  xSpeed = 10;

  offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  /**
   * Initializes a new throwable object and starts its animation.
   * @param {number} x - The x-coordinate of the object.
   * @param {number} y - The y-coordinate of the object.
   * @param {World} world - The world instance where the object is located.
   * @param {number} [throwDirectionX=1] - The direction in which the object is thrown (1 for right, -1 for left).
   */
  constructor(x, y, world, throwDirectionX = 1) {
    super().loadImage("./assets/img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.world = world;
    this.audioManager = world.audioManager;
    this.x = x;
    this.y = y;
    this.throwDirectionX = throwDirectionX;
    this.throw();
    this.animate();
  }

  /**
   * Starts the bottle throw and applies gravity to it.
   */
  throw = () => {
    this.world.audioManager.playSound("bottleThrow");
    this.applyGravity();
    this.startThrowInterval();
  };

  /**
   * Starts the throw interval for movement and collision checks.
   */
  startThrowInterval = () => {
    this.throwIntervalId = setStoppableInterval(() => {
      this.x += this.xSpeed * this.throwDirectionX;
      this.checkEnemyCollisions();
      this.splashOnGround();
    }, 25);
  };

  /**
   * Checks for collisions with all enemies.
   */
  checkEnemyCollisions = () => {
    this.world.level.enemies.forEach((enemy) => {
      if (this.isColliding(enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  };

  /**
   * Checks if the bottle has hit the ground and starts the splash effect.
   */
  splashOnGround = () => {
    if (this.y > this.groundY) {
      this.y = this.groundY;
      this.collide = true;
      this.xSpeed = 2;
      this.startSplash();
    }
  };

  /**
   * Handles collision between the bottle and enemies.
   * @param {DrawableObject} enemy - The enemy object involved in the collision
   */
  handleEnemyCollision = (enemy) => {
    if (this.isColliding(enemy) && !this.collide) {
      this.collide = true;
      this.xSpeed = 0;
      this.processEnemyHit(enemy);
    }
  };

  /**
   * Processes the hit based on enemy type.
   * @param {DrawableObject} enemy - The enemy object
   */
  processEnemyHit = (enemy) => {
    if (this.isSmallEnemy(enemy)) {
      this.handleBottleActionEnemies(enemy);
    } else if (enemy instanceof Endboss) {
      this.handleBottleActionEndboss(enemy);
    }
  };

  /**
   * Checks if the enemy is a small enemy type.
   * @param {DrawableObject} enemy - The enemy object
   * @returns {boolean} True if small enemy
   */
  isSmallEnemy = (enemy) => {
    return (
      enemy instanceof Chick ||
      enemy instanceof Chicken ||
      enemy instanceof CounterStrikeChicken
    );
  };

  /**
   * Handles the action when the bottle collides with enemies.
   * @param {DrawableObject} enemy - The enemy object
   */
  handleBottleActionEnemies = (enemy) => {
    this.xSpeed = 0;
    this.startSplash();
    this.audioManager.playSound("opponentDeath");
    enemy.hitOpponent();
  };

  /**
   * Handles the action when the bottle collides with the end boss.
   * @param {Endboss} enemy - The end boss object
   */
  handleBottleActionEndboss = (enemy) => {
    this.xSpeed = 2;
    enemy.hitBoss();
    this.startSplash();
    this.audioManager.playSound("opponentDeath");
  };

  /**
   * Starts the splash animation and removes the bottle after a delay.
   */
  startSplash = () => {
    if (this.splashStarted) return;
    this.xSpeed = 2;
    this.stopRotation();
    this.playSplashAnimation();
    this.scheduleRemoval();
  };

  /**
   * Stops the rotation animation.
   */
  stopRotation = () => {
    if (this.rotateIntervalId) clearInterval(this.rotateIntervalId);
  };

  /**
   * Plays the splash animation.
   */
  playSplashAnimation = () => {
    this.audioManager.playSound("bottleSplash");
    this.splashIntervalId = setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 60);
  };

  /**
   * Schedules the bottle removal.
   */
  scheduleRemoval = () => {
    this.removeTimeoutId = setTimeout(() => this.removeBottle(), 700);
  };

  /**
   * Removes the bottle from the world and stops all associated intervals.
   */
  removeBottle = () => {
    clearInterval(this.throwIntervalId);
    if (this.splashIntervalId) clearInterval(this.splashIntervalId);
    this.world.throwableObjects = this.world.throwableObjects.filter(
      (obj) => obj !== this
    );
  };

  /**
   * Animates the throwable object by rotating it.
   */
  animate = () => {
    this.rotateIntervalId = setStoppableInterval(() => {
      if (!this.collide) this.playAnimation(this.IMAGES_ROTATION);
    }, 100);
  };
}
