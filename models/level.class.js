/**
 * @fileoverview Level class for game level configuration.
 * @description Manages game level objects including enemies, clouds, backgrounds, bottles, and coins.
 * @module models/level-class
 */

"use strict";

/**
 * Level class that contains all objects for a game level.
 * @class
 */
class Level {
  enemies;
  clouds;
  background;
  bottles;
  coins;

  level_begin_x = 160;
  level_end_x = 4500;

  /**
   * Initializes a new level with specified game objects.
   * @param {Object} config - Configuration object for the level.
   * @param {Array<Enemy>} config.enemies - Array of enemy objects.
   * @param {Array<Cloud>} config.clouds - Array of cloud objects.
   * @param {Array<Background>} config.background - Array of background objects.
   * @param {Array<Bottle>} config.bottles - Array of bottle objects.
   * @param {Array<Coin>} config.coins - Array of coin objects.
   */
  constructor(config) {
    this.enemies = config.enemies || [];
    this.clouds = config.clouds || [];
    this.background = config.background || [];
    this.bottles = config.bottles || [];
    this.coins = config.coins || [];
  }
}
