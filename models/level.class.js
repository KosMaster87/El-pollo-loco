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
  level_end_x = 4000;

  /**
   * Initializes a new level with specified game objects.
   * @param {Array<Enemy>} enemiesArray - Array of enemy objects to be included in the level.
   * @param {Array<Cloud>} cloudsArray - Array of cloud objects to be included in the level.
   * @param {Array<Background>} backgroundArray - Array of background objects to be included in the level.
   * @param {Array<Bottle>} bottlesArray - Array of bottle objects to be included in the level.
   * @param {Array<Coin>} coinsArray - Array of coin objects to be included in the level.
   */
  constructor(
    enemiesArray,
    cloudsArray,
    backgroundArray,
    bottlesArray,
    coinsArray
  ) {
    this.enemies = enemiesArray;
    this.clouds = cloudsArray;
    this.background = backgroundArray;
    this.bottles = bottlesArray;
    this.coins = coinsArray;
  }
}
