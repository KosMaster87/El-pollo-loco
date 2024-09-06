"use strict";

class Chicken extends MovableObject {
  IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["./img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  y = 390;
  height = 55;
  width = 55;
  energy = 100;

  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  constructor() {
    super().loadImage("./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.images = {};
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.15 + Math.random() * 0.25;
    this.x = 200 + Math.random() * 10000;
    this.animate();
  }

  /**
   * Speed optionts and Running direction.
   * Also some animations.
   */
  animate() {
    this.walkingInterval = setStoppableInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    this.animationInterval = setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 1000 / 7);
  }

  /**
   * Logic for hitting the opponent.
   */
  hit_anyOpponent() {
    this.energy = 0;
    this.die_this();
  }

  /**
   * Kill logic for the chicken.
   * Delete from enemy array.
   */
  die_this() {
    this.audioManager.playSound("opponentDeath");
    clearInterval(this.walkingInterval);
    clearInterval(this.animationInterval);
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      this.world.level.enemies = this.world.level.enemies.filter(
        (enemy) => enemy !== this
      );
    }, 700);
  }
}
