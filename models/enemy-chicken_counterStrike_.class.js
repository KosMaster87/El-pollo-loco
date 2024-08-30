"use strict";

class CounterStrikeChicken extends MovableObject {
  IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_ATTACK = [
    "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["./img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  y = 390;
  height = 55;
  width = 55;
  energy = 100;
  isAttacking = false;
  isJumping = false;

  constructor(endBossRef) {
    super().loadImage("./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.images = {};
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.5 + Math.random() * 0.25;
    this.endBossRef = endBossRef;
    this.applyGravity();
    this.animate();
  }

  spawnRightPlace(index) {
    const boss = this.endBossRef;
    const bossHeight = boss.height;
    const bossMidY = boss.y + bossHeight / 2;

    const offsetX = 10 * (index % 10) + Math.random() * 50;
    const offsetY = (Math.random() - 0.5) * 0.4 * bossHeight;

    this.x = boss.x + offsetX;
    this.y = bossMidY + offsetY;
    // console.log(this);
  }

  startAttackPhase() {
    this.isAttacking = true;
    this.speed += 0.4;

    this.attackInterval_first = setStoppableInterval(() => {
      if (this.isAttacking) {
        this.moveLeft();
        this.playAnimation(this.IMAGES_ATTACK);
      }
    }, 1000 / 60);

    setTimeout(() => {
      this.stopAttackPhase();
    }, 2000);
  }

  stopAttackPhase() {
    this.isAttacking = false;
    this.speed -= 0.2;
    clearInterval(this.attackInterval_first);
  }

  isAboveGround() {
    return this.y < 390;
  }

  /**
   * Speed options and Running direction.
   * Also some animations.
   */
  animate() {
    this.walkingInterval = setStoppableInterval(
      () => this.moveLeft(),
      1800 / 60
    );

    this.animationInterval = setStoppableInterval(
      () => this.playAnimation(this.IMAGES_WALKING),
      1800 / 7
    );

    // Zufälliges Springen hinzufügen
    this.jumpInterval = setStoppableInterval(() => {
      if (!this.isAboveGround() && !this.isAttacking && !this.isJumping) {
        this.jump();
      }
    }, 2000 + Math.random() * 3000);
  }

  jump() {
    if (this.isJumping) return;
    this.isJumping = true;

    const jumpDistanceX = 100;
    this.speedY = 15;

    const targetPositionX = this.x - jumpDistanceX;

    const smoothJump = () => {
      if (this.x > targetPositionX) {
        this.x -= 2;
        requestAnimationFrame(smoothJump);
      } else {
        this.isJumping = false;
      }
    };

    smoothJump();
  }

  /**
   * Logik für Treffer an dem Gegner.
   */
  hit_anyOpponent() {
    this.energy = 0;
    this.die_this();
  }

  /**
   * Tötungslogik für das Huhn.
   * Aus dem enemy array löschen.
   */
  die_this() {
    this.world.audioManager.playSound("bossDeath");
    this.stopAllIntervals();
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      this.world.level.enemies = this.world.level.enemies.filter(
        (enemy) => enemy !== this
      );
    }, 700);
  }

  stopAllIntervals() {
    clearInterval(this.attackInterval_first);
    clearInterval(this.walkingInterval);
    clearInterval(this.animationInterval);
    clearInterval(this.jumpInterval);
  }
}
