/**
 * @fileoverview Handler for enemy alerts in the game.
 * @description Manages boss alert checks based on distance to character.
 * @module models/alert-handler
 */

"use strict";

/**
 * Handles enemy alert logic.
 * @class
 */
class AlertHandler {
  /**
   * Creates a new AlertHandler instance.
   * @param {World} world - Reference to the world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks if the boss should go on alert based on its distance to the character.
   */
  checkAlerts = () => {
    this.world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.checkDistanceToCharacter(this.world.character);
      }
    });
  };
}
