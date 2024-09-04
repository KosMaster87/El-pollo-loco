"use strict";

class MovableObject extends DrawableObject {
  energy = 100;
  lastHit = 0;
  hitCooldown = 1000;
  otherDirection = false;
  speedY = 0;
  acceleration = 1;

  /**
   * Calculation of the area for each object.
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
   * Define the gravity for the character and for the bottles.
   * This must be greater than 0 because the jump fn should only work above the ground.
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
   * Confirming whether the object is above the ground.
   * For Pepe, the else part of the query is always executed.
   * @returns boolean
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 280;
    }
  }

  /**
   * Pepes Controls
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Pepes Controls
   * Also moves the clouds and the chickens.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Pushing Pepe back during a collision with an enemy.
   */
  handleCharacterPushback(enemy) {
    let targetPosition;

    if (enemy instanceof Endboss) {
      targetPosition = this.x - 150;
    } else if (enemy instanceof Chicken) {
      targetPosition = this.x - 70;
    } else if (enemy instanceof CounterStrikeChicken) {
      targetPosition = this.x - 70;
    } else if (enemy instanceof Chick) {
      targetPosition = this.x - 55;
    }

    this.pushLeftSmooth(targetPosition);
  }

  /**
   * A smooth push back of Pepe in a collision with the opponent.
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
   * Only for Pepe to control his acceleration for jumping.
   */
  jump() {
    this.speedY = 15;
  }

  /**
   * #1 hit: Pepe's life energy => Pepe is invulnerable for one second.
   * Checks whether Pepe has taken damage within the last second.
   * => Only then hit (this.lastHit)!
   * @returns Boolean
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * #2 Egergie: Pepe's life energy => Energy can only be reduced every one second.
   * Causes damage to the character and updates the status bar.
   *
   * A hit is only counted if the difference between the current time and the last hit
   * is greater than or equal to the specified cooldown period (hitCooldown).
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
   * Pepes is dying.
   * @returns Boolean
   */
  isDead() {
    return this.energy == 0;
  }
}
