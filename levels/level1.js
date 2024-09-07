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
    backgroundObjects.push(
      new BackgroundObject("./img/5_background/layers/air.png", pos)
    );
    backgroundObjects.push(
      new BackgroundObject(
        `./img/5_background/layers/3_third_layer/${layerNumber}.png`,
        pos
      )
    );
    backgroundObjects.push(
      new BackgroundObject(
        `./img/5_background/layers/2_second_layer/${layerNumber}.png`,
        pos
      )
    );
    backgroundObjects.push(
      new BackgroundObject(
        `./img/5_background/layers/1_first_layer/${layerNumber}.png`,
        pos
      )
    );
  });

  return new Level(enemies, clouds, backgroundObjects, bottles, coins);
}

/**
 * Initializes the level by creating the level objects and storing them in the `level1` variable.
 */
function initLevel() {
  level1 = createLevel();
}
