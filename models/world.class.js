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
  collisionBlocked = false;
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

  /**
   * Assigns the world reference to the character and sets its properties.
   */
  assignWorldToCharacter() {
    this.character = new Character(this.audioManager, this.staticInstance);
    this.character.world = this;
    this.character.isGameRunning = this.isGameRunning;
  }

  /**
   * Assigns the world reference to each enemy in the level and sets their properties.
   */
  assignWorldToEnemies() {
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      enemy.audioManager = this.audioManager;
      enemy.staticInstance = this.staticInstance;
      enemy.isGameRunning = this.isGameRunning;
    });
  }

  /**
   * Finds and returns the reference to the boss in the level.
   * @returns {Endboss} The boss instance.
   */
  setBossRef() {
    return this.level.enemies.find((enemy) => enemy instanceof Endboss);
  }

  /**
   * Starts the game loop with intervals for checking collisions, applying damage,
   * throwing objects, and checking alerts.
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
   * Checks for collisions between the character and enemies, bottles, and coins.
   */
  checkCollisions() {
    this.enemieStatusRelationPepe();
    this.checkBottleStatusToEarn();
    this.checkCoinStatusToEarn();
    this.checkThrowableObjectCollisions();
  }

  /**
   * Applies damage to the character if they are colliding with an enemy.
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
   * Checks if the boss should go on alert based on its distance to the character.
   */
  checkAlerts() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.checkDistanceToCharacter(this.character);
      }
    });
  }

  /**
   * Handles the status and collisions of enemies with the character.
   */
  enemieStatusRelationPepe() {
    if (this.activeEnemyInteraction) {
      return;
    }

    this.level.enemies.forEach((enemy) => {
      this.handleCollisionWithEnemy(enemy);
    });
  }

  /**
   * Handles the collision between the character and an enemy.
   * @param {Object} enemy - The enemy object involved in the collision.
   */
  handleCollisionWithEnemy(enemy) {
    if (this.character.isColliding(enemy)) {
      this.lastEnemyColliding(enemy);

      if (
        this.character.y + this.character.height < enemy.y + enemy.height &&
        this.character.speedY < 0
      ) {
        this.activeEnemyAlsoHit(enemy);
      }
    }
  }

  /**
   * Saves the last enemy the character collided with.
   * @param {Object} enemy - The enemy object that was collided with.
   */
  lastEnemyColliding(enemy) {
    this.character.lastCollidedEnemy = {
      ...enemy,
      x: enemy.x,
      y: enemy.y,
    };
  }

  /**
   * Handles the actions when the character interacts with an enemy and hits the enemy.
   * @param {Object} enemy - The enemy object that was hit.
   */
  activeEnemyAlsoHit(enemy) {
    this.activeEnemyInteraction = true;
    this.character.speedY = 10;

    if (enemy instanceof Endboss) {
      enemy.hit_Boss();
    } else {
      enemy.hit_anyOpponent();
    }

    this.collisionBlocked = true;

    setTimeout(() => {
      this.collisionBlocked = false;
      this.activeEnemyInteraction = false;
    }, 100);
  }

  /**
   * Checks if the character has collided with a bottle and updates the status bar accordingly.
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
   * Checks if the character has collided with a coin and updates the status bar accordingly.
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
   * Checks for collisions between thrown bottles and enemies.
   */
  checkThrowableObjectCollisions() {
    this.throwableObjects.forEach((throwableObject) => {
      this.level.enemies.forEach((enemy) => {
        throwableObject.handleEnemyCollision_thisBottle(enemy);
      });
    });
  }

  /**
   * Handles the logic for throwing a bottle.
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
   * Creates a new throwable bottle object with a specific position and direction.
   * @returns {ThrowableObject} The created throwable object.
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
   * Handles the throwing of a bottle and updates the character's bottle status.
   * @param {ThrowableObject} bottle - The throwable object to be handled.
   */
  handleThrowableObject(bottle) {
    bottle.world = this;
    this.throwableObjects.push(bottle);
    this.character.bottles.pop();
    this.statusBarBottle.setPercentage(this.character.bottles.length * 20);
    this.lastThrowTime = Date.now();
  }

  /**
   * Draws the current state of the world including all objects and status bars.
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
   * Adds level-specific objects to the map.
   */
  addLevelObjects() {
    this.addObjectsToMap(this.level.background);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
  }

  /**
   * Adds all status bars to the map.
   */
  addBars() {
    this.addToMap(this.statusBarPepe);
    this.addToMap(this.statusBarBoss);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);
  }

  /**
   * Creates a loop to maintain a frame rate for drawing.
   * This method repeatedly calls `draw` using `requestAnimationFrame` to ensure smooth rendering.
   */
  setSelfDraw() {
    let self = this;

    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Adds a collection of objects to the map.
   * These objects are generally those that move automatically (e.g., enemies, items) and are not directly controlled by the user.
   * @param {Object[]} objects - The array of objects to be added to the map.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single movable object to the map.
   * Handles the flipping of images for objects facing different directions.
   * @param {MovableObject} mo - The movable object to be added to the map.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    // mo.drawFrame(this.ctx); // Optional: Use this to show or hide frame.

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the image horizontally for objects facing right-to-left.
   * Updates the object's x-coordinate to reflect the mirrored image.
   * @param {MovableObject} mo - The movable object whose image is to be flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Reverses the horizontal flip applied to an object.
   * Restores the canvas state to its original, left-to-right configuration.
   * @param {MovableObject} mo - The movable object whose image flip is to be reversed.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Schedules the spawning of Counter-Strike chickens after a delay.
   * Calls `spawnChickens` method after 500 milliseconds.
   */
  scheduleChickenSpawn() {
    setTimeout(() => {
      this.spawnChickens();
    }, 500);
  }

  /**
   * Creates and initializes Counter-Strike chickens.
   * Integrates these chickens into the enemy array and starts their attack phase.
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
   * Helper function to create a specified number of objects using a factory function.
   * @param {number} count - The number of objects to create.
   * @param {function} createFunc - The factory function to create an object.
   * @returns {Object[]} An array of created objects.
   */
  createObjects(count, createFunc) {
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(createFunc());
    }

    return objects;
  }
}
