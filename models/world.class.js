/**
 * @fileoverview World class managing the game environment.
 * @description Handles game world, character, enemies, collisions, and rendering on canvas.
 * @module models/world-class
 */

"use strict";

/**
 * World class that manages the entire game environment.
 * @class
 */
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
  lastHealTime = 0;
  healCooldown = 500;

  collisionHandler;
  bossAttackStartTime = null;
  counterStrikeChickens = [];

  /**
   * Creates a new World instance.
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering.
   * @param {Keyboard} keyboard - The keyboard input handler.
   * @param {AudioManager} audioManager - The audio manager instance.
   * @param {Static} staticInstance - The static resources instance.
   * @param {boolean} isGameRunning - Whether the game is currently running.
   */
  constructor(canvas, keyboard, audioManager, staticInstance, isGameRunning) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audioManager = audioManager;
    this.staticInstance = staticInstance;
    this.isGameRunning = isGameRunning;
    this.level = level1;
    this.collisionHandler = new CollisionHandler(this);
    this.assignWorldToCharacter();
    this.assignWorldToEnemies();
    this.endBossRef = this.setBossRef();
    this.draw();
    this.run();
  }

  /**
   * Assigns the world reference to the character and sets its properties.
   * @returns {void}
   */
  assignWorldToCharacter() {
    this.character = new Character(this.audioManager, this.staticInstance);
    this.character.world = this;
    this.character.isGameRunning = this.isGameRunning;
  }

  /**
   * Assigns the world reference to each enemy in the level and sets their properties.
   * @returns {void}
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
   * @returns {void}
   */
  run() {
    setStoppableInterval(() => {
      this.collisionHandler.checkAllCollisions();
    }, 50);

    setStoppableInterval(() => {
      this.collisionHandler.applyEnemyDamage();
    }, 50);

    setStoppableInterval(() => {
      this.throwObject();
    }, 100);

    setStoppableInterval(() => {
      this.checkHealAction();
    }, 100);

    setStoppableInterval(() => {
      this.updateHealPrompt();
    }, 200);

    setStoppableInterval(() => {
      this.updateThrowPrompt();
    }, 200);

    setStoppableInterval(() => {
      this.checkAlerts();
    }, 200);
  }

  /**
   * Checks if the boss should go on alert based on its distance to the character.
   * @returns {void}
   */
  checkAlerts() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.checkDistanceToCharacter(this.character);
      }
    });
  }

  /**
   * Handles the logic for throwing a bottle.
   * @returns {void}
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
   * @returns {void}
   */
  handleThrowableObject(bottle) {
    bottle.world = this;
    this.throwableObjects.push(bottle);
    this.character.bottles.pop();
    this.statusBarBottle.setPercentage(this.character.bottles.length * 20);
    this.lastThrowTime = Date.now();
  }

  /**
   * Checks if the heal key is pressed and triggers healing.
   * @returns {void}
   */
  checkHealAction() {
    const now = Date.now();

    if (
      this.keyboard.HEAL &&
      this.character.coins.length >= 5 &&
      this.character.energy < 100 &&
      now - this.lastHealTime >= this.healCooldown
    ) {
      this.character.heal();
      this.updateStatusBarsAfterHeal();
      this.lastHealTime = now;
    }
  }

  /**
   * Updates status bars after healing.
   * @returns {void}
   */
  updateStatusBarsAfterHeal() {
    this.statusBarPepe.setPercentage(this.character.energy);
    this.statusBarCoin.setPercentage(0);
  }

  /**
   * Shows or hides the heal prompt based on conditions.
   * @returns {void}
   */
  updateHealPrompt() {
    const isMobile =
      window.innerWidth <= 667 ||
      (window.innerWidth <= 1080 &&
        window.matchMedia("(orientation: landscape)").matches);
    const canHeal =
      this.character.coins.length >= 5 && this.character.energy < 100;

    if (!isMobile) {
      const healPromptDesktop = document.getElementById("healPromptDesktop");
      if (healPromptDesktop) {
        healPromptDesktop.style.display = canHeal ? "block" : "none";
      }
    }
  }

  /**
   * Shows or hides the throw prompt based on bottle availability.
   * @returns {void}
   */
  updateThrowPrompt() {
    const isMobile =
      window.innerWidth <= 667 ||
      (window.innerWidth <= 1080 &&
        window.matchMedia("(orientation: landscape)").matches);
    const hasBottles = this.character.bottles.length > 0;

    if (!isMobile) {
      const throwPromptDesktop = document.getElementById("throwPromptDesktop");
      if (throwPromptDesktop) {
        throwPromptDesktop.style.display = hasBottles ? "block" : "none";
      }
    }
  }

  /**
   * Draws the current state of the world including all objects and status bars.
   * @returns {void}
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background with parallax (no camera translation needed)
    this.addBackgroundWithParallax(this.level.background);

    // Translate for game objects
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    // Draw UI elements (no translation)
    this.addBars();

    this.setSelfDraw();
  }

  /**
   * Adds level-specific objects to the map.
   * @returns {void}
   */
  addLevelObjects() {
    this.addBackgroundWithParallax(this.level.background);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
  }

  /**
   * Adds background objects with parallax effect.
   * Applies camera translation with parallax factor - lower parallaxSpeed values move slower (further away).
   * @param {BackgroundObject[]} backgrounds - Array of background objects.
   * @returns {void}
   */
  addBackgroundWithParallax(backgrounds) {
    backgrounds.forEach((bg) => {
      this.ctx.save();
      const parallaxX = this.camera_x * bg.parallaxSpeed;
      this.ctx.translate(parallaxX, 0);
      bg.draw(this.ctx);
      this.ctx.restore();
    });
  }

  /**
   * Adds all status bars to the map.
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
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
   * @returns {void}
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Schedules the spawning of Counter-Strike chickens after a delay.
   * Calls `spawnChickens` method after 500 milliseconds.
   * @returns {void}
   */
  scheduleChickenSpawn() {
    setTimeout(() => {
      this.spawnChickens();
    }, 500);
  }

  /**
   * Creates and initializes Counter-Strike chickens.
   * Integrates these chickens into the enemy array and starts their attack phase.
   * @returns {void}
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
