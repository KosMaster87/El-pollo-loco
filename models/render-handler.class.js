/**
 * @fileoverview Handler for rendering the game world.
 * @description Manages canvas rendering, parallax, and object drawing.
 * @module models/render-handler
 */

"use strict";

/**
 * Handles rendering logic for the game world.
 * @class
 */
class RenderHandler {
  /**
   * Creates a new RenderHandler instance.
   * @param {World} world - Reference to the world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Draws the current state of the world including all objects and status bars.
   */
  draw = () => {
    this.clearCanvas();
    this.drawBackground();
    this.drawGameObjects();
    this.drawUI();
    this.setSelfDraw();
  };

  /**
   * Clears the canvas for the next frame.
   */
  clearCanvas = () => {
    this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
  };

  /**
   * Draws background with parallax effect.
   */
  drawBackground = () => {
    this.addBackgroundWithParallax(this.world.level.background);
  };

  /**
   * Draws all game objects with camera translation.
   */
  drawGameObjects = () => {
    this.world.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToMap(this.world.level.clouds);
    this.addObjectsToMap(this.world.level.bottles);
    this.addObjectsToMap(this.world.level.coins);
    this.addObjectsToMap(this.world.level.enemies);
    this.addToMap(this.world.character);
    this.addObjectsToMap(this.world.throwableObjects);
    this.world.ctx.translate(-this.world.camera_x, 0);
  };

  /**
   * Draws UI elements without camera translation.
   */
  drawUI = () => {
    this.addBars();
  };

  /**
   * Adds background objects with parallax effect.
   * @param {BackgroundObject[]} backgrounds - Array of background objects
   */
  addBackgroundWithParallax = (backgrounds) => {
    backgrounds.forEach((bg) => {
      this.world.ctx.save();
      const parallaxX = this.world.camera_x * bg.parallaxSpeed;
      this.world.ctx.translate(parallaxX, 0);
      bg.draw(this.world.ctx);
      this.world.ctx.restore();
    });
  };

  /**
   * Adds all status bars to the map.
   */
  addBars = () => {
    this.addToMap(this.world.statusBarPepe);
    this.addToMap(this.world.statusBarBoss);
    this.addToMap(this.world.statusBarBottle);
    this.addToMap(this.world.statusBarCoin);
  };

  /**
   * Creates a loop to maintain a frame rate for drawing.
   */
  setSelfDraw = () => {
    requestAnimationFrame(() => this.draw());
  };

  /**
   * Adds a collection of objects to the map.
   * @param {Object[]} objects - The array of objects to be added to the map
   */
  addObjectsToMap = (objects) => {
    objects.forEach((o) => this.addToMap(o));
  };

  /**
   * Adds a single movable object to the map.
   * @param {MovableObject} mo - The movable object to be added to the map
   */
  addToMap = (mo) => {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.world.ctx);
    // mo.drawFrame(this.world.ctx); // Optional: Use this to show or hide frame.
    if (mo.otherDirection) this.flipImageBack(mo);
  };

  /**
   * Flips the image horizontally for objects facing right-to-left.
   * @param {MovableObject} mo - The movable object whose image is to be flipped
   */
  flipImage = (mo) => {
    this.world.ctx.save();
    this.world.ctx.translate(mo.width, 0);
    this.world.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  };

  /**
   * Reverses the horizontal flip applied to an object.
   * @param {MovableObject} mo - The movable object whose image flip is to be reversed
   */
  flipImageBack = (mo) => {
    mo.x = mo.x * -1;
    this.world.ctx.restore();
  };
}
