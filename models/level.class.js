"use strict";

class Level {
  enemies;
  clouds;
  background;
  bottles;
  coins;

  // Das ist die Grende für den Pepe zur rechten Seite. Zur linken Seite ist in der character.class in der animate() bzw. EnterKeyboard() Methode.
  level_begin_x = -500;
  level_end_x = 2000;
  // level_end_x = 5800;

  /**
   * Hier ist die Reichenfolge der Argumente entscheident im Bezug zu der Reichenfolge des "new Level" Objektes.
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
