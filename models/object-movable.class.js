/**
 * @fileoverview Movable object class with physics and collision detection.
 * @description Extends DrawableObject with movement, collision detection, and gravity physics.
 * @module models/object-movable.class
 */

"use strict";

/**
 * Base class for movable objects with physics and collision detection.
 * @class
 * @extends {DrawableObject}
 */
class MovableObject extends DrawableObject {
  energy = 100;
  lastHit = 0;
  hitCooldown = 1000;
  otherDirection = false;
  speedY = 0;
  acceleration = 1;

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Checks if this object is colliding with another object.
   * @param {DrawableObject} obj - The object to check for collision with
   * @returns {boolean} True if the objects are colliding
   */
  isColliding = (obj) => {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left &&
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top &&
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom
    );
  };

  /**
   * Applies gravity to the object, affecting its vertical position and speed.
   * Gravity is applied as long as the object is above the ground or falling.
   */
  applyGravity() {
    setStoppableInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 26);
  }

  /**
   * Checks if the object is above the ground.
   * @returns {boolean} True if the object is above the ground
   */
  isAboveGround = () => {
    if (this instanceof ThrowableObject) return true;
    return this.y < 280;
  };

  /**
   * Moves the object to the right.
   */
  moveRight = () => {
    this.x += this.speed;
  };

  /**
   * Moves the object to the left.
   */
  moveLeft = () => {
    this.x -= this.speed;
  };

  /**
   * Handles the pushback of the character during a collision with an enemy.
   * @param {MovableObject} enemy - The enemy object causing the pushback
   */
  handleCharacterPushback = (enemy) => {
    const direction = enemy.x < this.x ? "right" : "left";
    const targetPosition = this.calculatePushTarget(enemy, direction);

    if (direction === "right") {
      this.pushRightSmooth(targetPosition);
    } else {
      this.pushLeftSmooth(targetPosition);
    }
  };

  /**
   * Calculates the target position for the pushback based on the enemy and direction.
   * @param {MovableObject} enemy - The enemy object
   * @param {string} direction - The direction of the push ("left" or "right")
   * @returns {number} The target position to push the character to
   */
  calculatePushTarget = (enemy, direction) => {
    const offset = this.getPushOffset(enemy);
    return direction === "right" ? this.x + offset : this.x - offset;
  };

  /**
   * Gets the push offset based on enemy type.
   * @param {MovableObject} enemy - The enemy object
   * @returns {number} The offset distance
   */
  getPushOffset = (enemy) => {
    if (enemy instanceof Endboss) return 150;
    if (enemy instanceof Chicken || enemy instanceof CounterStrikeChicken)
      return 70;
    if (enemy instanceof Chick) return 55;
    return 0;
  };

  /**
   * Smoothly pushes the character to the left until the target position is reached.
   * @param {number} targetPosition - The target position to move the character to
   */
  pushLeftSmooth = (targetPosition) => {
    if (this.pushbackAnimationId)
      cancelAnimationFrame(this.pushbackAnimationId);
    this.animatePushLeft(targetPosition, 2);
  };

  /**
   * Animates the left push movement.
   * @param {number} targetPosition - The target position
   * @param {number} step - The step size for movement
   */
  animatePushLeft = (targetPosition, step) => {
    const smoothMove = () => {
      if (this.shouldCancelPush()) {
        this.pushbackAnimationId = null;
        return;
      }
      if (this.x > targetPosition) {
        this.x -= step;
        this.pushbackAnimationId = requestAnimationFrame(smoothMove);
      } else {
        this.pushbackAnimationId = null;
      }
    };
    smoothMove();
  };

  /**
   * Smoothly pushes the character to the right until the target position is reached.
   * @param {number} targetPosition - The target position to move the character to
   */
  pushRightSmooth = (targetPosition) => {
    if (this.pushbackAnimationId)
      cancelAnimationFrame(this.pushbackAnimationId);
    this.animatePushRight(targetPosition, 3);
  };

  /**
   * Animates the right push movement.
   * @param {number} targetPosition - The target position
   * @param {number} step - The step size for movement
   */
  animatePushRight = (targetPosition, step) => {
    const smoothMove = () => {
      if (this.shouldCancelPush()) {
        this.pushbackAnimationId = null;
        return;
      }
      if (this.x < targetPosition) {
        this.x += step;
        this.pushbackAnimationId = requestAnimationFrame(smoothMove);
      } else {
        this.pushbackAnimationId = null;
      }
    };
    smoothMove();
  };

  /**
   * Checks if the push animation should be cancelled.
   * @returns {boolean} True if push should be cancelled
   */
  shouldCancelPush = () => {
    return (
      this.world.keyboard.LEFT ||
      this.world.keyboard.RIGHT ||
      !this.world.collisionHandler.activeEnemyInteraction
    );
  };

  /**
   * Makes the character jump by setting the vertical speed.
   */
  jump = () => {
    this.speedY = 15;
  };

  /**
   * Checks if the character is currently hurt based on the last hit time.
   * @returns {boolean} True if the character is hurt
   */
  isHurt = () => {
    const timePassed = (new Date().getTime() - this.lastHit) / 1000;
    return timePassed < 1;
  };

  /**
   * Applies damage to the character and updates the cooldown period between hits.
   */
  hitPepe = () => {
    const now = Date.now();
    if (now - this.lastHit >= this.hitCooldown) {
      this.energy = Math.max(0, this.energy - 10);
      this.lastHit = now;
    }
  };

  /**
   * Checks if the character is dead based on its energy.
   * @returns {boolean} True if the character is dead
   */
  isDead = () => {
    return this.energy === 0;
  };
}
