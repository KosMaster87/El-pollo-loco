/**
 * @fileoverview Endboss enemy class.
 * @description Manages the final boss enemy with multiple states and animations.
 * @module models/enemy-endboss
 */

"use strict";

/**
 * Endboss enemy class.
 * @class
 * @extends {MovableObject}
 */
class Endboss extends MovableObject {
  IMAGES_ALERT = [
    "./assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_WALKING = [
    "./assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_HURT = [
    "./assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "./assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "./assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "./assets/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  IMAGES_ATTACK = [
    "./assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  offset = {
    top: 60,
    bottom: 0,
    left: 50,
    right: 20,
  };

  height = 400;
  width = 300;
  y = 50;
  speed = 3;
  hits = 0;
  isBossWalking = false;
  isBossAlert = false;
  isBossHurt = false;
  isBossAttack = false;
  isBossDead = false;
  attackSpeedMultiplier = 8;
  counterStrikeChickens = [];

  /**
   * Creates an instance of Endboss.
   * Initializes image loading and sets initial position and state.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.images = {};
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 4800;
    this.animate();
    this.checkDistanceToCharacter();
  }

  /**
   * Handles the animation of the boss based on its current state.
   */
  animate = () => {
    this.animationInterval = setStoppableInterval(() => {
      this.updateBossAnimation();
    }, 200);
  };

  /**
   * Updates the boss animation based on current state.
   */
  updateBossAnimation = () => {
    if (this.isBossDead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isBossHurt) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isBossAttack) {
      this.playAnimation(this.IMAGES_ATTACK);
      this.moveTowardsCharacter();
    } else if (this.isBossAlert) {
      this.playAnimation(this.IMAGES_ALERT);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
      this.moveLeft();
    }
  };

  /**
   * Moves the boss towards the character during an attack.
   */
  moveTowardsCharacter = () => {
    const speed = this.isBossAttack
      ? this.speed * this.attackSpeedMultiplier
      : this.speed;
    this.x -= speed;
  };

  /**
   * Handles the boss's hit logic.
   */
  hitBoss = () => {
    this.hits += 1;
    const newPercentage = Math.max(100 - this.hits * 20, 0);
    this.world.statusBarBoss.setPercentage(newPercentage);
    this.world.audioManager.playSound("bossHurting");

    if (this.hits >= 5) {
      this.die();
    } else {
      this.triggerCounterStrike();
    }
  };

  /**
   * Triggers the counter-strike phase where the boss attacks and spawns strike chickens.
   */
  triggerCounterStrike = () => {
    this.world.audioManager.playSound("bossAttacking");
    if (!this.isBossAttack) {
      this.startCounterStrike();
    }
  };

  /**
   * Starts the counter-strike sequence.
   */
  startCounterStrike = () => {
    this.isBossHurt = true;
    this.isBossAttack = true;
    this.scheduleChickenSpawn();
    setTimeout(() => this.endHurtPhase(), 1000);
  };

  /**
   * Ends the hurt phase and schedules end of attack.
   */
  endHurtPhase = () => {
    this.isBossHurt = false;
    setTimeout(() => this.endAttackPhase(), 3000);
  };

  /**
   * Ends the attack phase.
   */
  endAttackPhase = () => {
    this.world.audioManager.stopSound("bossAttacking");
    this.isBossAttack = false;
  };

  /**
   * Handles the boss's death logic.
   */
  die = () => {
    if (gameEnded) return;
    gameEnded = true;
    this.isBossDead = true;
    setTimeout(() => this.removeFromEnemies(), 700);
    setTimeout(() => this.triggerGameWin(), 1000);
  };

  /**
   * Removes boss from enemies array.
   */
  removeFromEnemies = () => {
    this.world.level.enemies = this.world.level.enemies.filter(
      (enemy) => enemy !== this
    );
  };

  /**
   * Triggers the game win sequence.
   */
  triggerGameWin = () => {
    this.world.audioManager.playSound("gameWin");
    gameWin();
  };

  /**
   * Checks the distance between the boss and the character periodically.
   */
  checkDistanceToCharacter = () => {
    setStoppableInterval(() => {
      if (this.isCloseTo(this.world.character, 250)) {
        if (!this.isBossAlert) this.isBossAlert = true;
      } else {
        this.isBossAlert = false;
      }
    }, 1000 / 10);
  };

  /**
   * Checks if the boss is within a specified distance from the character.
   * @param {object} character - The character to check distance to
   * @param {number} distance - The distance threshold
   * @returns {boolean} True if within distance
   */
  isCloseTo = (character, distance) => {
    return Math.abs(this.x - character.x) < distance;
  };

  /**
   * Schedules the spawning of Counter-Strike chickens after a delay.
   */
  scheduleChickenSpawn = () => {
    setTimeout(() => this.spawnChickens(), 500);
  };

  /**
   * Creates and initializes Counter-Strike chickens.
   */
  spawnChickens = () => {
    this.counterStrikeChickens = this.createChickens(5);
    this.counterStrikeChickens.forEach((chicken, index) => {
      this.initializeChicken(chicken, index);
    });
    this.world.level.enemies.push(...this.counterStrikeChickens);
  };

  /**
   * Creates multiple CounterStrike chickens.
   * @param {number} count - Number of chickens to create
   * @returns {CounterStrikeChicken[]} Array of created chickens
   */
  createChickens = (count) => {
    const chickens = [];
    for (let i = 0; i < count; i++) {
      chickens.push(new CounterStrikeChicken(this));
    }
    return chickens;
  };

  /**
   * Initializes a chicken with world reference and position.
   * @param {CounterStrikeChicken} chicken - The chicken to initialize
   * @param {number} index - The chicken's index
   */
  initializeChicken = (chicken, index) => {
    chicken.world = this.world;
    chicken.spawnRightPlace(index);
    chicken.startAttackPhase();
  };
}
