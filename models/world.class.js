"use strict";

class World {
  level;
  endBossRef;
  character;
  isGameRunning;

  ctx;
  canvas;
  keyboard;
  camera_x = 0;

  statusBarBoss = new BossStatusBar();
  statusBarPepe = new CharacterStatusBar();
  statusBarCoin = new CoinStatusBar();
  statusBarBottle = new BottleStatusBar();

  throwableObjects = [];
  lastThrowTime = 0;
  throwCooldown = 500;

  activeEnemyInteraction = false;
  bossAttackStartTime = null;
  counterStrikeChickens = [];

  constructor(canvas, keyboard, audioManager, staticInstance, isGameRunning) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audioManager = audioManager;
    this.staticInstance = staticInstance;
    this.isGameRunning = isGameRunning;
    this.level = level1;
    this.assignWorldToCharacter();
    this.assignWorldToEnemies();
    this.endBossRef = this.setBossRef();
    this.draw();
    this.run();
  }

  assignWorldToCharacter() {
    this.character = new Character(this.audioManager, this.staticInstance);
    this.character.world = this;
    this.character.isGameRunning = this.isGameRunning;
  }

  assignWorldToEnemies() {
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      enemy.audioManager = this.audioManager;
      enemy.staticInstance = this.staticInstance;
      enemy.isGameRunning = this.isGameRunning;
    });
  }

  setBossRef() {
    return this.level.enemies.find((enemy) => enemy instanceof Endboss);
  }

  /**
   * Check the timing of Pepe's collusion with the enemies.
   * As well as the touch of the bottles.
   */
  run() {
    setStoppableInterval(() => {
      this.checkCollisions();
    }, 50);

    setStoppableInterval(() => {
      this.applyDamageToCharacter();
    }, 50);

    setStoppableInterval(() => {
      this.throwObject();
    }, 100);

    setStoppableInterval(() => {
      this.checkAlerts();
    }, 200);
  }

  /**
   * Counter-Strike is triggered by hit_Boss().
   * And this is where the time of appearance is determined.
   */
  scheduleChickenSpawn() {
    setTimeout(() => {
      this.spawnChickens();
    }, 500);
  }

  /**
   * Creating the counter strike chicken.
   * As well as integrating it into the enemy array.
   */
  spawnChickens() {
    this.counterStrikeChickens = this.createObjects(
      5,
      () => new CounterStrikeChicken(this.endBossRef)
    );

    this.counterStrikeChickens.forEach((chicken, index) => {
      chicken.world = this;
      chicken.spawnRightPlace(index);
      chicken.startAttackPhase();
    });

    this.level.enemies.push(...this.counterStrikeChickens);
  }

  /**
   * Helper function to create the strike chicken as an object.
   */
  createObjects(count, createFunc) {
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(createFunc());
    }

    return objects;
  }

  /**
   * Check if Pepe collision with Objects.
   */
  checkCollisions() {
    this.enemieStatusRelationPepe();
    this.checkBottleStatusToEarn();
    this.checkCoinStatusToEarn();
    this.checkThrowableObjectCollisions();
  }

  /**
   * Simply read out the current state of the damage itself.
   * @returns Bolean
   */
  applyDamageToCharacter() {
    if (this.activeEnemyInteraction) {
      return;
    }

    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (!enemy.isDead()) {
          this.activeEnemyInteraction = true;
          this.character.hitPepe();
          this.statusBarPepe.setPercentage(this.character.energy);
          this.character.handleCharacterPushback(enemy);

          setTimeout(() => {
            this.activeEnemyInteraction = false;
          }, 200);
        }
      }
    });
  }

  /**
   * The boss should go on alert.
   */
  checkAlerts() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.checkDistanceToCharacter(this.character);
      }
    });
  }

  /**
   * Here is the scope of the colliding objects.
   * @returns boolean
   */
  enemieStatusRelationPepe() {
    if (this.activeEnemyInteraction) {
      return;
    }

    this.level.enemies.forEach((enemy) => {
      this.handleCollisionWithEnemy(enemy);
    });
  }

  handleCollisionWithEnemy(enemy) {
    if (this.character.isColliding(enemy)) {
      this.character.lastCollidedEnemy = {
        ...enemy,
        x: enemy.x,
        y: enemy.y,
      };
      if (
        this.character.y + this.character.height < enemy.y + enemy.height &&
        this.character.speedY < 0
      ) {
        this.activeEnemyInteraction = true;
        if (enemy instanceof Endboss) {
          enemy.hit_Boss();
        } else {
          enemy.hit_anyOpponent();
        }

        this.character.speedY = 10;

        setTimeout(() => {
          this.activeEnemyInteraction = false;
        }, 100);
      }
    }
  }

  /**
   * Check if Pepe collision with Bottle.
   */
  checkBottleStatusToEarn() {
    this.level.bottles.forEach((bottle, index) => {
      if (
        this.character.isColliding(bottle) &&
        this.character.bottles.length < this.character.maxBottles
      ) {
        this.character.collectBottle();
        this.level.bottles.splice(index, 1);
        let newPercentage = Math.min(this.character.bottles.length * 20, 100);
        this.statusBarBottle.setPercentage(newPercentage);
      }
    });
  }

  /**
   * Check if Pepe collision with Bottle.
   */
  checkCoinStatusToEarn() {
    this.level.coins.forEach((coin, index) => {
      if (
        this.character.isColliding(coin) &&
        this.character.coins.length < this.character.maxCoins
      ) {
        this.character.collectCoin();
        this.level.coins.splice(index, 1);
        let newPercentage = Math.min(this.character.coins.length * 20, 100);
        this.statusBarCoin.setPercentage(newPercentage);
      }
    });
  }

  /**
   * Check if the thrown bottle collided with an opponent.
   */
  checkThrowableObjectCollisions() {
    this.throwableObjects.forEach((throwableObject) => {
      this.level.enemies.forEach((enemy) => {
        throwableObject.handleEnemyCollision_thisBottle(enemy);
      });
    });
  }

  /**
   * Throw a salsa bottle.
   */
  throwObject() {
    const now = Date.now();

    if (
      this.keyboard.THROW &&
      this.character.bottles.length > 0 &&
      now - this.lastThrowTime >= this.throwCooldown
    ) {
      const bottle = this.createThrowableObject();
      this.handleThrowableObject(bottle);
    }
  }

  /**
   * Create and throw a bottle.
   * Offset for position of the thrown bottle.
   */
  createThrowableObject() {
    const throwDirectionX = this.character.otherDirection ? -1 : 1;
    const xOffset = 0;
    const yOffset = 10;

    return new ThrowableObject(
      this.character.x + (throwDirectionX === 1 ? 70 : -70) + xOffset,
      this.character.y + 35 + yOffset,
      this,
      throwDirectionX
    );
  }

  /**
   * Check the direction of the bottle throw and the number of bottles Pepe has.
   */
  handleThrowableObject(bottle) {
    bottle.world = this;
    this.throwableObjects.push(bottle);
    this.character.bottles.pop();
    this.statusBarBottle.setPercentage(this.character.bottles.length * 20);
    this.lastThrowTime = Date.now();
  }

  /**
   * Draw what ever in this.World
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addLevelObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.addBars();
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.setSelfDraw();
  }

  /**
   *To draw!
   */
  addLevelObjects() {
    this.addObjectsToMap(this.level.background);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
  }

  /**
   *To draw!
   */
  addBars() {
    this.addToMap(this.statusBarPepe);
    this.addToMap(this.statusBarBoss);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottle);
  }

  /**
   * A repetition of itself to create a frame rate.
   */
  setSelfDraw() {
    let self = this;

    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds any objects with specific attributes.
   * Basically, these objects should move automatically without any user input. In contrast to Pepe, where he is only drawn as soon as an input is made.
   * @param {The objects in this world.} objects
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * The if query handles the character, its mirror image, and the mirrored coordinates of the canvas for the character.
   * Add to Canvas Board each things.
   * @param {movable object} mo
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx); // Hide or show here.

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * The "flips" are for mirroring the images.
   * Set the right-to-left state.
   * @param {movable-object} mo
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * The "flips" are for mirroring the images.
   * Set the left-to-right state.
   * @param {movable-object} mo
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
