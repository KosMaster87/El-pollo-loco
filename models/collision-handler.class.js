/**
 * @fileoverview Collision detection and handling system.
 * @description Manages all collision logic between game objects.
 * @module models/collision-handler
 */

"use strict";

/**
 * Handles all collision detection and responses in the game world.
 * @class
 */
class CollisionHandler {
  world;
  activeEnemyInteraction = false;
  collisionBlocked = false;

  /**
   * Creates a CollisionHandler instance.
   * @param {World} world - Reference to game world
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Main collision check entry point.
   * @returns {void}
   */
  checkAllCollisions() {
    this.checkEnemyCollisions();
    this.checkBottleCollisions();
    this.checkCoinCollisions();
    this.checkThrowableCollisions();
  }

  /**
   * Checks character collisions with enemies.
   * @returns {void}
   */
  checkEnemyCollisions() {
    if (this.activeEnemyInteraction) return;

    this.world.level.enemies.forEach((enemy) => {
      this.handleEnemyCollision(enemy);
    });
  }

  /**
   * Handles collision between character and single enemy.
   * @param {Object} enemy - Enemy object
   * @returns {void}
   */
  handleEnemyCollision(enemy) {
    if (!this.world.character.isColliding(enemy)) return;

    this.saveLastCollidedEnemy(enemy);

    if (this.isCharacterJumpingOnEnemy(enemy)) {
      this.handleCharacterAttackEnemy(enemy);
    }
  }

  /**
   * Checks if character is jumping on enemy.
   * @param {Object} enemy - Enemy object
   * @returns {boolean} - True if jumping attack
   */
  isCharacterJumpingOnEnemy(enemy) {
    const char = this.world.character;
    return char.y + char.height < enemy.y + enemy.height && char.speedY < 0;
  }

  /**
   * Saves last collided enemy position.
   * @param {Object} enemy - Enemy object
   * @returns {void}
   */
  saveLastCollidedEnemy(enemy) {
    this.world.character.lastCollidedEnemy = {
      ...enemy,
      x: enemy.x,
      y: enemy.y,
    };
  }

  /**
   * Handles character attacking enemy from above.
   * @param {Object} enemy - Enemy being attacked
   * @returns {void}
   */
  handleCharacterAttackEnemy(enemy) {
    this.activeEnemyInteraction = true;
    this.world.character.speedY = 10;

    if (enemy instanceof Endboss) {
      enemy.hitBoss();
    } else {
      enemy.hitOpponent();
    }

    this.collisionBlocked = true;
    setTimeout(() => this.resetCollisionState(), 100);
  }

  /**
   * Resets collision interaction flags.
   * @returns {void}
   */
  resetCollisionState() {
    this.collisionBlocked = false;
    this.activeEnemyInteraction = false;
  }

  /**
   * Applies damage when enemies hit character.
   * @returns {void}
   */
  applyEnemyDamage() {
    if (this.activeEnemyInteraction) return;

    this.world.level.enemies.forEach((enemy) => {
      if (this.shouldApplyDamage(enemy)) {
        this.damageCharacter(enemy);
      }
    });
  }

  /**
   * Checks if damage should be applied.
   * @param {Object} enemy - Enemy object
   * @returns {boolean} - True if should damage
   */
  shouldApplyDamage(enemy) {
    return this.world.character.isColliding(enemy) && !enemy.isDead();
  }

  /**
   * Damages character and handles pushback.
   * @param {Object} enemy - Enemy causing damage
   * @returns {void}
   */
  damageCharacter(enemy) {
    this.activeEnemyInteraction = true;
    this.world.character.hitPepe();
    this.world.statusBarPepe.setPercentage(this.world.character.energy);
    this.world.character.handleCharacterPushback(enemy);

    setTimeout(() => {
      this.activeEnemyInteraction = false;
    }, 200);
  }

  /**
   * Checks bottle collection collisions.
   * @returns {void}
   */
  checkBottleCollisions() {
    this.world.level.bottles.forEach((bottle, index) => {
      if (this.canCollectBottle(bottle)) {
        this.collectBottle(index);
      }
    });
  }

  /**
   * Checks if character can collect bottle.
   * @param {Object} bottle - Bottle object
   * @returns {boolean} - True if can collect
   */
  canCollectBottle(bottle) {
    const char = this.world.character;
    return char.isColliding(bottle) && char.bottles.length < char.maxBottles;
  }

  /**
   * Collects bottle and updates UI.
   * @param {number} index - Bottle array index
   * @returns {void}
   */
  collectBottle(index) {
    this.world.character.collectBottle();
    this.world.level.bottles.splice(index, 1);
    const percentage = Math.min(this.world.character.bottles.length * 20, 100);
    this.world.statusBarBottle.setPercentage(percentage);
  }

  /**
   * Checks coin collection collisions.
   * @returns {void}
   */
  checkCoinCollisions() {
    this.world.level.coins.forEach((coin, index) => {
      if (this.canCollectCoin(coin)) {
        this.collectCoin(index);
      }
    });
  }

  /**
   * Checks if character can collect coin.
   * @param {Object} coin - Coin object
   * @returns {boolean} - True if can collect
   */
  canCollectCoin(coin) {
    const char = this.world.character;
    return char.isColliding(coin) && char.coins.length < char.maxCoins;
  }

  /**
   * Collects coin and updates UI.
   * @param {number} index - Coin array index
   * @returns {void}
   */
  collectCoin(index) {
    this.world.character.collectCoin();
    this.world.level.coins.splice(index, 1);
    const percentage = Math.min(this.world.character.coins.length * 20, 100);
    this.world.statusBarCoin.setPercentage(percentage);
  }

  /**
   * Checks throwable object collisions with enemies.
   * @returns {void}
   */
  checkThrowableCollisions() {
    this.world.throwableObjects.forEach((throwable) => {
      this.world.level.enemies.forEach((enemy) => {
        throwable.handleEnemyCollision(enemy);
      });
    });
  }
}
