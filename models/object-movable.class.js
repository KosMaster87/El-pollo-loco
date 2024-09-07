"use strict";

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
   * @param {DrawableObject} obj - The object to check for collision with.
   * @returns {boolean} - True if the objects are colliding, false otherwise.
   */
  isColliding(obj) {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left &&
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top &&
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom
    );
  }

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
   * @returns {boolean} - True if the object is above the ground, false otherwise.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 280;
    }
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   * Also moves the clouds and the chickens.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Handles the pushback of the character during a collision with an enemy, considering the enemy's offset.
   * @param {MovableObject} enemy - The enemy object causing the pushback.
   */
  handleCharacterPushback(enemy) {
    if (enemy.x < this.x) {
      const targetPosition = this.calculatePushTarget(enemy, "right");
      this.pushRightSmooth(targetPosition);
    } else {
      const targetPosition = this.calculatePushTarget(enemy, "left");
      this.pushLeftSmooth(targetPosition);
    }
  }

  /**
   * Calculates the target position for the pushback based on the enemy and direction.
   * @param {MovableObject} enemy - The enemy object.
   * @param {string} direction - The direction of the push ("left" or "right").
   * @returns {number} - The target position to push the character to.
   */
  calculatePushTarget(enemy, direction) {
    let offset;

    if (enemy instanceof Endboss) {
      offset = 150;
    } else if (
      enemy instanceof Chicken ||
      enemy instanceof CounterStrikeChicken
    ) {
      offset = 70;
    } else if (enemy instanceof Chick) {
      offset = 55;
    }

    return direction === "right" ? this.x + offset : this.x - offset;
  }

  /**
   * Smoothly pushes the character to the left until the target position is reached.
   * @param {number} targetPosition - The target position to move the character to.
   */
  pushLeftSmooth(targetPosition) {
    let step = 2;

    const smoothMove = () => {
      if (this.world.keyboard.LEFT) {
        return;
      }

      if (this.x > targetPosition) {
        this.x -= step;
        requestAnimationFrame(smoothMove);
      }
    };

    smoothMove();
  }

  /**
   * Smoothly pushes the character to the right until the target position is reached.
   * @param {number} targetPosition - The target position to move the character to.
   */
  pushRightSmooth(targetPosition) {
    let step = 3;

    const smoothMove = () => {
      if (this.world.keyboard.RIGHT) {
        return;
      }

      if (this.x < targetPosition) {
        this.x += step;
        requestAnimationFrame(smoothMove);
      }
    };

    smoothMove();
  }

  /**
   * Makes the character jump by setting the vertical speed.
   */
  jump() {
    this.speedY = 15;
  }

  /**
   * Checks if the character is currently hurt based on the last hit time.
   * @returns {boolean} - True if the character is hurt, false otherwise.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * Applies damage to the character and updates the cooldown period between hits.
   * The character's energy is reduced and cannot go below zero.
   */
  hitPepe() {
    const now = Date.now();

    if (now - this.lastHit >= this.hitCooldown) {
      this.energy -= 10;
      this.lastHit = now;

      if (this.energy < 0) {
        this.energy = 0;
      }
    }
  }

  /**
   * Checks if the character is dead based on its energy.
   * @returns {boolean} - True if the character is dead, false otherwise.
   */
  isDead() {
    return this.energy == 0;
  }
}
