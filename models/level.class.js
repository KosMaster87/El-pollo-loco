"use strict";

class Level {
  enemies;
  clouds;
  background;
  bottles;
  coins;

  level_begin_x = 0;
  level_end_x = 4000;

  /**
   * Here the order of the arguments is crucial in relation to the range order of the "new level" object.
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
