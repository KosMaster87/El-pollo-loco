/**
 * @fileoverview Counter-strike chicken enemy class.
 * @description Manages counter-strike chickens that spawn from the boss.
 * @module models/enemy-chicken-counterstrike
 */

"use strict";

/**
 * Counter-strike chicken enemy class.
 * @class
 * @extends {MovableObject}
 */
class CounterStrikeChicken extends MovableObject {
  IMAGES_WALKING = [
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_ATTACK = [
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = [
    "./assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];

  y = 390;
  height = 55;
  width = 55;
  energy = 100;
  isAttacking = false;
  isJumping = false;

  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  /**
   * Creates an instance of CounterStrikeChicken.
   * Initializes image loading, sets random speed, applies gravity, and starts animation.
   * @param {Object} endBossRef - Reference to the end boss.
   */
  constructor(endBossRef) {
    super().loadImage(
      "./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
    this.images = {};
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.5 + Math.random() * 0.25;
    this.endBossRef = endBossRef;
    this.applyGravity();
    this.animate();
  }

  /**
   * Determines the spawn position of the strike chicken based on its index.
   * @param {number} index - The index of the strike chicken
   */
  spawnRightPlace = (index) => {
    const boss = this.endBossRef;
    const bossMidY = boss.y + boss.height / 2;
    this.x = boss.x + this.calculateOffsetX(index);
    this.y = bossMidY + this.calculateOffsetY(boss.height);
  };

  /**
   * Calculates the X offset for spawning.
   * @param {number} index - The chicken index
   * @returns {number} The X offset
   */
  calculateOffsetX = (index) => {
    return 10 * (index % 10) + Math.random() * 50;
  };

  /**
   * Calculates the Y offset for spawning.
   * @param {number} bossHeight - The boss height
   * @returns {number} The Y offset
   */
  calculateOffsetY = (bossHeight) => {
    return (Math.random() - 0.5) * 0.4 * bossHeight;
  };

  /**
   * Starts the attack phase, increasing speed and playing attack animation.
   */
  startAttackPhase = () => {
    this.isAttacking = true;
    this.speed += 0.4;
    this.startAttackInterval();
    setTimeout(() => this.stopAttackPhase(), 2000);
  };

  /**
   * Starts the attack interval.
   */
  startAttackInterval = () => {
    this.attackInterval_first = setStoppableInterval(() => {
      if (this.isAttacking) {
        this.moveLeft();
        this.playAnimation(this.IMAGES_ATTACK);
      }
    }, 1000 / 60);
  };

  /**
   * Stops the attack phase, resetting speed and clearing the attack interval.
   */
  stopAttackPhase = () => {
    this.isAttacking = false;
    this.speed -= 0.2;
    clearInterval(this.attackInterval_first);
  };

  /**
   * Checks if the chicken is above ground.
   * @returns {boolean} True if the chicken is above ground
   */
  isAboveGround = () => {
    return this.y < 390;
  };

  /**
   * Handles the animation of the chicken, including movement, walking, and jumping.
   */
  animate = () => {
    this.startWalkingInterval();
    this.startAnimationInterval();
    this.startJumpInterval();
  };

  /**
   * Starts the walking interval.
   */
  startWalkingInterval = () => {
    this.walkingInterval = setStoppableInterval(
      () => this.moveLeft(),
      1800 / 60
    );
  };

  /**
   * Starts the animation interval.
   */
  startAnimationInterval = () => {
    this.animationInterval = setStoppableInterval(
      () => this.playAnimation(this.IMAGES_WALKING),
      1800 / 7
    );
  };

  /**
   * Starts the jump interval.
   */
  startJumpInterval = () => {
    this.jumpInterval = setStoppableInterval(() => {
      if (this.canJump()) this.jump();
    }, 2000 + Math.random() * 3000);
  };

  /**
   * Checks if the chicken can jump.
   * @returns {boolean} True if the chicken can jump
   */
  canJump = () => {
    return !this.isAboveGround() && !this.isAttacking && !this.isJumping;
  };

  /**
   * Executes the jump sequence for the strike chicken.
   */
  jump = () => {
    if (this.isJumping) return;
    this.isJumping = true;
    this.speedY = 15;
    const targetPositionX = this.x - 100;
    this.animateJump(targetPositionX);
  };

  /**
   * Animates the jump movement.
   * @param {number} targetPositionX - The target X position
   */
  animateJump = (targetPositionX) => {
    const smoothJump = () => {
      if (this.x > targetPositionX) {
        this.x -= 2;
        requestAnimationFrame(smoothJump);
      } else {
        this.isJumping = false;
      }
    };
    smoothJump();
  };

  /**
   * Handles the logic for hitting an opponent.
   */
  hitOpponent = () => {
    this.energy = 0;
    this.die();
  };

  /**
   * Handles the death sequence for the strike chicken.
   */
  die = () => {
    this.world.audioManager.playSound("bossDeath");
    this.stopAllIntervals();
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => this.removeFromEnemies(), 700);
  };

  /**
   * Removes this chicken from the enemies array.
   */
  removeFromEnemies = () => {
    this.world.level.enemies = this.world.level.enemies.filter(
      (enemy) => enemy !== this
    );
  };

  /**
   * Stops all intervals related to the chicken's behavior.
   */
  stopAllIntervals = () => {
    clearInterval(this.attackInterval_first);
    clearInterval(this.walkingInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.jumpInterval);
  };
}
