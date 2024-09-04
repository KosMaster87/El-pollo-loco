"use strict";

class Chick extends MovableObject {
  IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["./img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  y = 400;
  height = 45;
  width = 45;
  energy = 100;

  constructor() {
    super().loadImage("./img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.images = {};
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.15 + Math.random() * 0.25;
    this.x = 200 + Math.random() * 10000;
    this.animate();
  }

  /**
   * Starts the movement and animation intervals.
   */
  animate() {
    this.walkingInterval = setStoppableInterval(
      () => this.moveLeft(),
      1000 / 60
    );
    this.animationInterval = setStoppableInterval(
      () => this.playAnimation(this.IMAGES_WALKING),
      1000 / 7
    );
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
   * Delete from the ememie array.
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
