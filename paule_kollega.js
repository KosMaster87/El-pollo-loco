// let enemyIntervals = [];

class Enemy extends MoveableObject {
  speed;
  health = 20;
  tolerance = 3;
  sightrangeOfEnemy = 350;

  IMAGES_WALKING = [
    "../assets/Enemies/Skeleton_Warrior/Walk_Mirrored/tile000.png",
    "../assets/Enemies/Skeleton_Warrior/Walk_Mirrored/tile001.png",
    "../assets/Enemies/Skeleton_Warrior/Walk_Mirrored/tile002.png",
    "../assets/Enemies/Skeleton_Warrior/Walk_Mirrored/tile003.png",
    "../assets/Enemies/Skeleton_Warrior/Walk_Mirrored/tile004.png",
    "../assets/Enemies/Skeleton_Warrior/Walk_Mirrored/tile005.png",
    "../assets/Enemies/Skeleton_Warrior/Walk_Mirrored/tile006.png",
  ];

  IMAGES_DEAD = [
    "../assets/Enemies/Skeleton_Warrior/Dead/tile000.png",
    "../assets/Enemies/Skeleton_Warrior/Dead/tile001.png",
    "../assets/Enemies/Skeleton_Warrior/Dead/tile002.png",
    "../assets/Enemies/Skeleton_Warrior/Dead/tile003.png",
  ];

  IMAGES_DEAD_ON_GROUND = [
    "../assets/Enemies/Skeleton_Warrior/Dead/tile003.png",
  ];

  IMAGES_ATTACK = [
    "../assets/Enemies/Skeleton_Warrior/Attack_1_Mirrored/tile000.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_1_Mirrored/tile001.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_1_Mirrored/tile002.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_1_Mirrored/tile003.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_1_Mirrored/tile004.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_2_Mirrored/tile000.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_2_Mirrored/tile001.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_2_Mirrored/tile002.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_2_Mirrored/tile003.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_2_Mirrored/tile004.png",
    "../assets/Enemies/Skeleton_Warrior/Attack_2_Mirrored/tile005.png",
  ];

  IMAGES_IDLE = [
    "../assets/Enemies/Skeleton_Warrior/Idle_Mirrored/tile000.png",
    "../assets/Enemies/Skeleton_Warrior/Idle_Mirrored/tile001.png",
    "../assets/Enemies/Skeleton_Warrior/Idle_Mirrored/tile002.png",
    "../assets/Enemies/Skeleton_Warrior/Idle_Mirrored/tile003.png",
    "../assets/Enemies/Skeleton_Warrior/Idle_Mirrored/tile004.png",
    "../assets/Enemies/Skeleton_Warrior/Idle_Mirrored/tile005.png",
    "../assets/Enemies/Skeleton_Warrior/Idle_Mirrored/tile006.png",
  ];

  constructor() {
    super().loadImage(
      "../assets/Enemies/Skeleton_Warrior/Walk_Mirrored/tile000.png"
    );
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_DEAD_ON_GROUND);
    this.x = 420 + Math.random() * 700;
    this.y = -50 + Math.random() * 200;
    this.speed = 3.5 + Math.random() * 1.0;
    this.isDead = false;
    this.animate();
  }

  animate() {
    let enemyDiesInterval = createInterval(
      allIntervals,
      () => {
        if (this.health <= 0 && !this.isDead) {
          console.log(this.health);
          clearInterval(moveTowardsCharacter);
          this.playOneTimeAnimationRevB(this.IMAGES_DEAD, enemyDiesInterval);
          this.collisionAllowed = false;

          this.enemySetIsDead();
        }
      },
      1000 / 10
    );

    let enemyIsDead = createInterval(
      allIntervals,
      () => {
        if (this.isDead) {
          clearInterval(enemyDiesInterval);
          this.playOneTimeAnimationRevB(
            this.IMAGES_DEAD_ON_GROUND,
            enemyIsDead
          );
        }
      },
      1000 / 10
    );

    let moveTowardsCharacter = createInterval(
      allIntervals,
      () => {
        if (world && world.character !== null && !this.isDead) {
          if (this.x - world.character.x < this.sightrangeOfEnemy) {
            if (!world.character.isColliding(this)) {
              this.playAnimation(this.IMAGES_WALKING);
            }
            if (world.character.isColliding(this)) {
              this.playAnimation(this.IMAGES_ATTACK);
              this.speed = 0;
            }
            if (world.character.x < this.x) {
              this.otherDirection = false;
              this.moveLeft();
              this.speed = 5.5 + Math.random() * 1.0;
            } else {
              this.otherDirection = true;
              this.moveRight();
              this.speed = 5.5 + Math.random() * 1.0;
            }
            if (world.character.y > this.y + this.tolerance) {
              this.moveDownEnemy();
            } else if (world.character.y < this.y - this.tolerance) {
              this.moveUpEnemy();
            }
          } else {
            this.playAnimation(this.IMAGES_IDLE);
          }
        }
      },
      1000 / 10
    );

    // enemyIntervals.push(enemyDiesInterval);
    // enemyIntervals.push(moveTowardsCharacter);
  }

  enemySetIsDead() {
    setTimeout(() => {
      this.isDead = true;
    }, 1000);
  }
}
