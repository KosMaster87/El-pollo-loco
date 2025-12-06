/**
 * @fileoverview World class managing the game environment.
 * @description Handles game world, character, enemies, collisions, and rendering on canvas.
 * @module models/world
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

  collisionHandler;
  throwHandler;
  healHandler;
  alertHandler;
  renderHandler;
  bossAttackStartTime = null;

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
    this.throwHandler = new ThrowHandler(this);
    this.healHandler = new HealHandler(this);
    this.alertHandler = new AlertHandler(this);
    this.renderHandler = new RenderHandler(this);
    this.assignWorldToCharacter();
    this.assignWorldToEnemies();
    this.endBossRef = this.setBossRef();
    this.renderHandler.draw();
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
      this.throwHandler.throwObject();
    }, 100);

    setStoppableInterval(() => {
      this.healHandler.checkHealAction();
    }, 100);

    setStoppableInterval(() => {
      this.healHandler.updateHealPrompt();
    }, 200);

    setStoppableInterval(() => {
      this.throwHandler.updateThrowPrompt();
    }, 200);

    setStoppableInterval(() => {
      this.alertHandler.checkAlerts();
    }, 200);
  }
}
