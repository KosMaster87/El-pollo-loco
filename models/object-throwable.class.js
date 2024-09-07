"use strict";

class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    "./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
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
    super().loadImage("./img/6_salsa_bottle/salsa_bottle.png");
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
   * Continuously moves the bottle and checks for collisions with enemies.
   */
  throw() {
    this.world.audioManager.playSound("bottleThrow");
    this.applyGravity();
    this.throwIntervalId = setStoppableInterval(() => {
      this.x += this.xSpeed * this.throwDirectionX;
      this.world.level.enemies.forEach((enemy) => {
        if (this.isColliding(enemy)) {
          this.handleEnemyCollision_thisBottle(enemy);
        }
      });

      this.splashOnGround();
    }, 25);
  }

  /**
   * Checks if the bottle has hit the ground and starts the splash effect.
   */
  splashOnGround() {
    if (this.y > this.groundY) {
      this.y = this.groundY;
      this.collide = true;
      this.xSpeed = 2;
      this.startSplash();
    }
  }

  /**
   * Handles collision between the bottle and enemies.
   * @param {DrawableObject} enemy - The enemy object involved in the collision.
   */
  handleEnemyCollision_thisBottle(enemy) {
    if (this.isColliding(enemy) && !this.collide) {
      this.collide = true;
      this.xSpeed = 0;

      if (
        enemy instanceof Chick ||
        enemy instanceof Chicken ||
        enemy instanceof CounterStrikeChicken
      ) {
        this.handleBottleActionEnemies(enemy);
      } else if (enemy instanceof Endboss) {
        this.handleBottleActionEndboss(enemy);
      }
    }
  }

  /**
   * Handles the action when the bottle collides with enemies.
   * @param {DrawableObject} enemy - The enemy object.
   */
  handleBottleActionEnemies(enemy) {
    this.xSpeed = 0;
    this.startSplash();
    this.audioManager.playSound("opponentDeath");
    enemy.hit_anyOpponent();
  }

  /**
   * Handles the action when the bottle collides with the end boss.
   * @param {Endboss} enemy - The end boss object.
   */
  handleBottleActionEndboss(enemy) {
    this.xSpeed = 2;
    enemy.hit_Boss();
    this.startSplash();
    this.audioManager.playSound("opponentDeath");
  }

  /**
   * Starts the splash animation and removes the bottle after a delay.
   * The splash animation is only started once.
   */
  startSplash() {
    if (this.splashStarted) return;
    this.xSpeed = 2;

    if (this.rotateIntervalId) {
      clearInterval(this.rotateIntervalId);
    }
    this.audioManager.playSound("bottleSplash");

    this.splashIntervalId = setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 60);

    this.removeTimeoutId = setTimeout(() => {
      this.removeBottle();
    }, 700);
  }

  /**
   * Removes the bottle from the world and stops all associated intervals.
   */
  removeBottle() {
    clearInterval(this.throwIntervalId);
    if (this.splashIntervalId) {
      clearInterval(this.splashIntervalId);
    }

    this.world.throwableObjects = this.world.throwableObjects.filter(
      (obj) => obj !== this
    );
  }

  /**
   * Animates the throwable object by rotating it.
   */
  animate() {
    this.rotateIntervalId = setStoppableInterval(() => {
      if (!this.collide) {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 100);
  }
}
