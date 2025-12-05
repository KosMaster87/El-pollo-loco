/**
 * @fileoverview Level 1 initialization.
 * @description Creates and configures the first game level with enemies, objects, and backgrounds.
 * @module levels/level1
 */

"use strict";

let level1;

/**
 * Creates a specified number of objects using the provided creation function.
 * @param {number} count - The number of objects to create.
 * @param {Function} createFunc - A function that generates a new object.
 * @returns {Array} - An array of created objects.
 */
function createObjects(count, createFunc) {
  const objects = [];
  for (let i = 0; i < count; i++) {
    objects.push(createFunc());
  }
  return objects;
}

/**
 * Creates and initializes the level by generating enemies, clouds, background objects, bottles, and coins.
 * Background layers use parallax scrolling for depth effect:
 * - Air layer: 0.2 (slowest, furthest away)
 * - Third layer: 0.5 (slow, far)
 * - Second layer: 0.8 (medium, middle distance)
 * - First layer: 1.0 (normal speed, foreground)
 * @returns {Level} - A new level instance containing enemies, clouds, background objects, bottles, and coins.
 */
function createLevel() {
  const bossChicken = [];
  bossChicken.push(new Endboss());

  const bottles = createObjects(20, () => new Bottle());
  const coins = createObjects(20, () => new Coin());
  const clouds = createObjects(20, () => new Cloud());
  const chicks = createObjects(30, () => new Chick());
  const chickens = createObjects(20, () => new Chicken());

  let enemies = [...chickens, ...chicks, ...bossChicken];

  const backgroundObjects = [];
  const positions = [
    -719,
    0,
    719,
    719 * 2,
    719 * 3,
    719 * 4,
    719 * 5,
    719 * 6,
    719 * 7,
    719 * 8,
  ];

  positions.forEach((pos, index) => {
    const layerNumber = (index % 2) + 1;

    // Sky/Air layer - slowest parallax (far away)
    backgroundObjects.push(
      new BackgroundObject("./img/5_background/layers/air.png", pos, 0.2)
    );

    // Third layer - slow parallax (far)
    backgroundObjects.push(
      new BackgroundObject(
        `./img/5_background/layers/3_third_layer/${layerNumber}.png`,
        pos,
        0.5
      )
    );

    // Second layer - medium parallax (middle distance)
    backgroundObjects.push(
      new BackgroundObject(
        `./img/5_background/layers/2_second_layer/${layerNumber}.png`,
        pos,
        0.8
      )
    );

    // First layer - normal speed (foreground)
    backgroundObjects.push(
      new BackgroundObject(
        `./img/5_background/layers/1_first_layer/${layerNumber}.png`,
        pos,
        1
      )
    );
  });

  return new Level(enemies, clouds, backgroundObjects, bottles, coins);
}

/**
 * Initializes the level by creating the level objects and storing them in the `level1` variable.
 * @returns {void}
 */
function initLevel() {
  level1 = createLevel();
}
