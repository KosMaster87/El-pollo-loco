/**
 * @fileoverview Handler for throwing objects in the game.
 * @description Manages bottle throwing mechanics and UI prompts.
 * @module models/throw-handler
 */

"use strict";

/**
 * Handles bottle throwing logic and UI updates.
 * @class
 */
class ThrowHandler {
  lastThrowTime = 0;
  throwCooldown = 500;

  /**
   * Creates a new ThrowHandler instance.
   * @param {World} world - Reference to the world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Handles the logic for throwing a bottle.
   */
  throwObject = () => {
    const now = Date.now();

    if (this.canThrow(now)) {
      const bottle = this.createThrowableObject();
      this.handleThrowableObject(bottle);
    }
  };

  /**
   * Checks if the character can throw a bottle.
   * @param {number} now - Current timestamp
   * @returns {boolean} True if character can throw
   */
  canThrow = (now) => {
    return (
      this.world.keyboard.THROW &&
      this.world.character.bottles.length > 0 &&
      now - this.lastThrowTime >= this.throwCooldown
    );
  };

  /**
   * Creates a new throwable bottle object with a specific position and direction.
   * @returns {ThrowableObject} The created throwable object
   */
  createThrowableObject = () => {
    const character = this.world.character;
    const throwDirectionX = character.otherDirection ? -1 : 1;
    const xOffset = 0;
    const yOffset = 10;

    return new ThrowableObject(
      character.x + (throwDirectionX === 1 ? 70 : -70) + xOffset,
      character.y + 35 + yOffset,
      this.world,
      throwDirectionX
    );
  };

  /**
   * Handles the throwing of a bottle and updates the character's bottle status.
   * @param {ThrowableObject} bottle - The throwable object to be handled
   */
  handleThrowableObject = (bottle) => {
    bottle.world = this.world;
    this.world.throwableObjects.push(bottle);
    this.world.character.bottles.pop();
    this.world.statusBarBottle.setPercentage(
      this.world.character.bottles.length * 20
    );
    this.lastThrowTime = Date.now();
  };

  /**
   * Shows or hides the throw prompt based on bottle availability.
   */
  updateThrowPrompt = () => {
    if (!this.isMobile()) {
      const hasBottles = this.world.character.bottles.length > 0;
      const throwPromptDesktop = document.getElementById("throwPromptDesktop");
      if (throwPromptDesktop) {
        throwPromptDesktop.style.display = hasBottles ? "block" : "none";
      }
    }
  };

  /**
   * Checks if the device is mobile.
   * @returns {boolean} True if device is mobile
   */
  isMobile = () => {
    return (
      window.innerWidth <= 667 ||
      (window.innerWidth <= 1080 &&
        window.matchMedia("(orientation: landscape)").matches)
    );
  };
}
