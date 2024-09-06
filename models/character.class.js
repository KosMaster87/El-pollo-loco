"use strict";

class Character extends MovableObject {
  IMAGES_WALKING = [
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37.png",
    "./img/2_character_pepe/3_jump/J-38.png",
    "./img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "./img/2_character_pepe/4_hurt/H-41.png",
    "./img/2_character_pepe/4_hurt/H-42.png",
    "./img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_IDLE = [
    "./img/2_character_pepe/1_idle/idle/I-1.png",
    "./img/2_character_pepe/1_idle/idle/I-2.png",
    "./img/2_character_pepe/1_idle/idle/I-3.png",
    "./img/2_character_pepe/1_idle/idle/I-4.png",
    "./img/2_character_pepe/1_idle/idle/I-5.png",
    "./img/2_character_pepe/1_idle/idle/I-6.png",
    "./img/2_character_pepe/1_idle/idle/I-7.png",
    "./img/2_character_pepe/1_idle/idle/I-8.png",
    "./img/2_character_pepe/1_idle/idle/I-9.png",
    "./img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_SLEEP = [
    "./img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  offset = {
    top: 80,
    bottom: 10,
    left: 20,
    right: 20,
  };

  bottles = [];
  coins = [];
  maxBottles = 5;
  maxCoins = 5;

  height = 170;
  width = 95;
  x = 0;
  y = 270;
  speed = 5;

  idleStart;
  sleepStart;
  idle = false;
  sleep = false;
  lastCollidedEnemy = null;

  constructor(audioManager) {
    super().loadImage("./img/2_character_pepe/2_walk/W-21.png");
    this.images = {};
    this.audioManager = audioManager;
    this.idleStart = Date.now();
    this.sleepStart = Date.now();
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEP);
    this.applyGravity();
    this.animate();
  }

  collectBottle() {
    this.bottles.push(new Bottle());
    this.world.audioManager.playSound("bottleEarn");
  }

  collectCoin() {
    if (this.coins.length < this.maxCoins) {
      this.coins.push(new Coin());
      this.world.audioManager.playSound("coinEarn");
    }
  }

  idleTimer() {
    let idleTime = (Date.now() - this.idleStart) / 1000;
    return idleTime >= 0.1;
  }

  sleepTimer() {
    let sleepTime = (Date.now() - this.sleepStart) / 1000;
    return sleepTime >= 2.5;
  }

  resetTimers() {
    this.reset_idleStartTimer();
    this.reset_sleepStartTimer();
  }

  reset_sleepStartTimer() {
    this.sleepStart = Date.now();
  }

  reset_idleStartTimer() {
    this.idleStart = Date.now();
  }

  handleSnoringSound() {
    if (this.sleep) {
      if (!this.snoringPlaying) {
        this.world.audioManager.playSound("snoring");
        this.snoringPlaying = true;
      }
    } else {
      if (this.snoringPlaying) {
        this.world.audioManager.stopSound("snoring");
        this.snoringPlaying = false;
      }
    }
  }

  stopIntervals() {
    clearInterval(this.moveInterval);
    clearInterval(this.animateInterval);
  }

  /**
   * Speed options and running direction.
   * Also some animations.
   */
  animate() {
    this.moveInterval = setStoppableInterval(() => this.pepeMove(), 1000 / 45);
    this.animateInterval = setStoppableInterval(
      () => this.pepeAnimate(),
      1000 / 7
    );
  }

  pepeMove() {
    if (this.collisionBlocked) {
      return;
    }

    this.preventSlidingPastEnemy();
    this.moveOnXAxis();
    this.pepeJump();
    this.world.camera_x = -this.x + 150;
  }

  /**
   * Blocks Pepe from sliding past enemies.
   */
  preventSlidingPastEnemy() {
    if (this.activeEnemyInteraction && this.character.lastCollidedEnemy) {
      const collidedEnemy = this.character.lastCollidedEnemy;
      if (this.world.keyboard.RIGHT && this.x < collidedEnemy.x) {
        return;
      }
      if (this.world.keyboard.LEFT && this.x > collidedEnemy.x) {
        return;
      }
    }
  }

  /**
   * Controls Pepe's movement on the X-axis.
   */
  moveOnXAxis() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.pepeMoveRightOptions();
      this.pepesIdleFalse();
      this.world.audioManager.playSound("walking");
    }

    if (this.world.keyboard.LEFT && this.x > this.world.level.level_begin_x) {
      this.pepeMoveLeftOptions();
      this.pepesIdleFalse();
      this.world.audioManager.playSound("walking");
    }
  }

  /**
   * Controls Pepe's jumping actions.
   */
  pepeJump() {
    if (
      (this.world.keyboard.SPACE && !this.isAboveGround()) ||
      (this.world.keyboard.UP && !this.isAboveGround())
    ) {
      this.jump();
      this.pepesIdleFalse();
      this.world.audioManager.playSound("jumping");
    }
  }

  pepesIdleFalse() {
    this.resetTimers();
    this.idle = false;
    this.sleep = false;
  }

  /**
   * Some auto playback images and gameOver.
   */
  pepeAnimate() {
    this.hurting();
    if (this.isDead()) {
      this.animateDead();
    } else if (this.isAboveGround()) {
      this.animateJumping();
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.animateWalking();
    } else this.handleIdleState();
    this.handleSnoringSound();
  }

  hurting() {
    if (this.isHurt() && !this.isDead()) {
      this.animateHurt();
      setTimeout(() => {
        this.world.audioManager.playSound("hurting");
      }, 500);
    }
  }

  handleIdleState() {
    if (
      this.idleTimer() &&
      !this.isAboveGround() &&
      !this.isHurt() &&
      !this.isDead()
    ) {
      this.idleAlsoSleep();
    }
  }

  idleAlsoSleep() {
    if (this.sleepTimer()) {
      this.animateSleeping();
      this.sleep = true;
      this.idle = false;
    } else {
      this.animateIdle();
      this.idle = true;
      this.sleep = false;
    }
  }

  animateHurt() {
    this.playAnimation(this.IMAGES_HURT);
    this.resetTimers();
    this.world.audioManager.playSound("hurting");
  }

  animateDead() {
    this.playAnimation(this.IMAGES_DEAD);
    this.world.audioManager.playSound("gameLose");
    gameOver();
  }

  animateJumping() {
    this.playAnimation(this.IMAGES_JUMPING);
    this.resetTimers();
  }

  animateWalking() {
    this.playAnimation(this.IMAGES_WALKING);
    this.resetTimers();
  }

  animateIdle() {
    this.playAnimation(this.IMAGES_IDLE);
    this.reset_idleStartTimer();
  }

  animateSleeping() {
    this.playAnimation(this.IMAGES_SLEEP);
  }

  pepeMoveRightOptions() {
    this.moveRight();
    this.otherDirection = false;
  }

  pepeMoveLeftOptions() {
    this.moveLeft();
    this.otherDirection = true;
  }
}
