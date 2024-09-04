"use strict";

class Endboss extends MovableObject {
  IMAGES_ALERT = [
    "./img/4_enemie_boss_chicken/2_alert/G5.png",
    "./img/4_enemie_boss_chicken/2_alert/G6.png",
    "./img/4_enemie_boss_chicken/2_alert/G7.png",
    "./img/4_enemie_boss_chicken/2_alert/G8.png",
    "./img/4_enemie_boss_chicken/2_alert/G9.png",
    "./img/4_enemie_boss_chicken/2_alert/G10.png",
    "./img/4_enemie_boss_chicken/2_alert/G11.png",
    "./img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_WALKING = [
    "./img/4_enemie_boss_chicken/1_walk/G1.png",
    "./img/4_enemie_boss_chicken/1_walk/G2.png",
    "./img/4_enemie_boss_chicken/1_walk/G3.png",
    "./img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_HURT = [
    "./img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "./img/4_enemie_boss_chicken/5_dead/G24.png",
    "./img/4_enemie_boss_chicken/5_dead/G25.png",
    "./img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  IMAGES_ATTACK = [
    "./img/4_enemie_boss_chicken/3_attack/G13.png",
    "./img/4_enemie_boss_chicken/3_attack/G14.png",
    "./img/4_enemie_boss_chicken/3_attack/G15.png",
    "./img/4_enemie_boss_chicken/3_attack/G16.png",
    "./img/4_enemie_boss_chicken/3_attack/G17.png",
    "./img/4_enemie_boss_chicken/3_attack/G18.png",
    "./img/4_enemie_boss_chicken/3_attack/G19.png",
    "./img/4_enemie_boss_chicken/3_attack/G20.png",
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

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.images = {};
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 3800;
    this.animate();
    this.checkDistanceToCharacter();
  }

  animate() {
    this.animationInterval = setStoppableInterval(() => {
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
    }, 200);
  }

  /**
   * Move the boss ATTACK towards the character.
   * Here is the multiplier for speed.
   */
  moveTowardsCharacter() {
    let speed = this.isBossAttack
      ? this.speed * this.attackSpeedMultiplier
      : this.speed;
    this.x -= speed;
  }

  /**
   * 1. Query for boss death.
   * 2. Logic for hitting the enemy.
   */
  hit_Boss() {
    this.hits += 1;
    let newPercentage = Math.max(100 - this.hits * 20, 0);
    this.world.statusBarBoss.setPercentage(newPercentage);
    audioManager.playSound("bossHurting");

    if (this.hits >= 5) {
      this.die();
    } else {
      this.triggerCounterStrike();
    }
  }

  /**
   * The boss remains in attack state for 3 seconds.
   * Boss is injured for 1 second.
   * Instructions for the strike chicken.
   */
  triggerCounterStrike() {
    this.world.audioManager.playSound("bossAttacking");
    if (!this.isBossAttack) {
      this.isBossHurt = true;
      this.isBossAttack = true;
      this.world.scheduleChickenSpawn();
      setTimeout(() => {
        this.isBossHurt = false;
        setTimeout(() => {
          this.world.audioManager.stopSound("bossAttacking");
          this.isBossAttack = false;
        }, 3000);
      }, 1000);
    }
  }

  /**
   * Killing logic for the chicken.
   */
  die() {
    this.isBossDead = true;

    setTimeout(() => {
      this.world.level.enemies = this.world.level.enemies.filter(
        (enemy) => enemy !== this
      );
    }, 700);

    setTimeout(() => {
      this.world.audioManager.playSound("gameWin");
      gameOver();
    }, 1000);
  }

  checkDistanceToCharacter() {
    setStoppableInterval(() => {
      if (this.isCloseTo(this.world.character, 250)) {
        if (!this.isBossAlert) {
          this.isBossAlert = true;
        }
      } else {
        this.isBossAlert = false;
      }
    }, 1000 / 10);
  }

  isCloseTo(character, distance) {
    return Math.abs(this.x - character.x) < distance;
  }
}
