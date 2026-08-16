/**
 * @fileoverview Level 1 initialization and configuration.
 * @description Creates and configures the first game level with intelligent object placement and collision detection.
 * @module levels/level1
 */

"use strict";

let level1;

/**
 * Creates multiple objects using a factory function.
 * @param {number} count - Number of objects to create
 * @param {Function} createFunc - Factory function that creates an object
 * @returns {Array} Array of created objects
 */
const createObjects = (count, createFunc) => {
  const objects = [];
  for (let i = 0; i < count; i++) {
    objects.push(createFunc());
  }
  return objects;
};

/**
 * Calculates distance between two object centers.
 * @param {number} x1 - X-coordinate of first object
 * @param {number} y1 - Y-coordinate of first object
 * @param {number} w1 - Width of first object
 * @param {number} h1 - Height of first object
 * @param {Object} obj2 - Second object with x, y, width, height properties
 * @returns {number} Distance between centers
 */
const calculateDistance = (x1, y1, w1, h1, obj2) => {
  const centerX1 = x1 + w1 / 2;
  const centerY1 = y1 + h1 / 2;
  const centerX2 = obj2.x + (obj2.width || 50) / 2;
  const centerY2 = obj2.y + (obj2.height || 50) / 2;
  return Math.sqrt(Math.pow(centerX1 - centerX2, 2) + Math.pow(centerY1 - centerY2, 2));
};

/**
 * Validates if a position has sufficient distance from existing objects.
 * @param {number} x - X-coordinate to validate
 * @param {number} y - Y-coordinate to validate
 * @param {number} width - Width of the object
 * @param {number} height - Height of the object
 * @param {Array} existingObjects - Array of existing objects to check against
 * @param {number} minDistance - Minimum required distance
 * @returns {boolean} True if position is valid, false otherwise
 */
const isPositionValid = (x, y, width, height, existingObjects, minDistance) => {
  for (let obj of existingObjects) {
    const distance = calculateDistance(x, y, width, height, obj);
    if (distance < minDistance) return false;
  }
  return true;
};

/**
 * Generates random Y-coordinate based on object type.
 * @param {string} objectType - Type of object ('bottle' or 'coin')
 * @returns {number} Random Y-coordinate
 */
const generateRandomY = (objectType) => {
  if (objectType === "coin") {
    const minY = 220;
    const maxY = 345;
    return minY + Math.random() * (maxY - minY);
  }
  return 370 + Math.random() * 10;
};

/**
 * Generates random position within level bounds.
 * @param {string} objectType - Type of object ('bottle' or 'coin')
 * @returns {Object} Object with x and y coordinates
 */
const generateRandomPosition = (objectType) => ({
  x: 1000 + Math.random() * 720 * 4,
  y: generateRandomY(objectType),
});

/**
 * Attempts to find valid position for an object.
 * @param {Object} obj - Object to position
 * @param {string} objectType - Type of object
 * @param {Array} existingObjects - Existing objects to avoid
 * @param {number} minDistance - Minimum distance from other objects
 * @param {number} maxAttempts - Maximum positioning attempts
 * @returns {boolean} True if valid position found, false otherwise
 */
const tryFindValidPosition = (obj, objectType, existingObjects, minDistance, maxAttempts) => {
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const pos = generateRandomPosition(objectType);
    obj.x = pos.x;
    obj.y = pos.y;

    if (
      isPositionValid(obj.x, obj.y, obj.width || 50, obj.height || 50, existingObjects, minDistance)
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Creates collectible with collision-free positioning.
 * @param {Function} createFunc - Factory function to create the object
 * @param {string} objectType - Type of object ('bottle' or 'coin')
 * @param {Array} existingObjects - Existing objects to avoid
 * @param {number} minDistance - Minimum distance from other objects
 * @param {number} maxAttempts - Maximum positioning attempts
 * @returns {Object|null} Created object or null if no valid position found
 */
const createCollectibleWithValidPosition = (
  createFunc,
  objectType,
  existingObjects,
  minDistance = 200,
  maxAttempts = 100
) => {
  const obj = createFunc();
  const positionFound = tryFindValidPosition(
    obj,
    objectType,
    existingObjects,
    minDistance,
    maxAttempts
  );

  if (!positionFound) {
    return null;
  }

  return obj;
};

/**
 * Creates multiple collectibles with spacing.
 * @param {number} count - Number of objects to create
 * @param {Function} createFunc - Factory function
 * @param {string} objectType - Type of object
 * @param {number} minDistance - Minimum distance between objects
 * @returns {Array} Array of created objects
 */
const createCollectiblesWithSpacing = (count, createFunc, objectType, minDistance = 200) => {
  const objects = [];

  for (let i = 0; i < count; i++) {
    const obj = createCollectibleWithValidPosition(createFunc, objectType, objects, minDistance);
    if (obj) objects.push(obj);
  }

  return objects;
};

/**
 * Creates coins with collision detection against bottles and other coins.
 * @param {Array} bottles - Existing bottles to avoid
 * @param {number} count - Number of coins to create
 * @param {number} minDistance - Minimum distance from other objects
 * @returns {Array} Array of created coins
 */
const createCoins = (bottles, count, minDistance) => {
  const coins = [];

  for (let i = 0; i < count; i++) {
    const coin = createCollectibleWithValidPosition(
      () => new Coin(),
      "coin",
      [...bottles, ...coins],
      minDistance,
      200
    );
    if (coin) coins.push(coin);
  }

  return coins;
};

/**
 * Creates background layer for parallax effect.
 * @param {string} path - Image path
 * @param {number} position - X position
 * @param {number} parallaxSpeed - Parallax speed factor
 * @returns {BackgroundObject} Background object
 */
const createBackgroundLayer = (path, position, parallaxSpeed) =>
  new BackgroundObject(path, position, parallaxSpeed);

/**
 * Creates all background layers for a single position.
 * @param {number} pos - X position for the background set
 * @param {number} layerNumber - Layer variant number (1 or 2)
 * @returns {Array} Array of 4 background layers
 */
const createBackgroundSet = (pos, layerNumber) => [
  createBackgroundLayer("./assets/img/5_background/layers/air.png", pos, 0.2),
  createBackgroundLayer(
    `./assets/img/5_background/layers/3_third_layer/${layerNumber}.png`,
    pos,
    0.5
  ),
  createBackgroundLayer(
    `./assets/img/5_background/layers/2_second_layer/${layerNumber}.png`,
    pos,
    0.8
  ),
  createBackgroundLayer(
    `./assets/img/5_background/layers/1_first_layer/${layerNumber}.png`,
    pos,
    1
  ),
];

/**
 * Creates all background objects with parallax layers.
 * @returns {Array} Array of all background objects
 */
const createBackgrounds = () => {
  const positions = [-719, 0, 719, 719 * 2, 719 * 3, 719 * 4, 719 * 5, 719 * 6, 719 * 7, 719 * 8];
  const backgrounds = [];

  positions.forEach((pos, index) => {
    const layerNumber = (index % 2) + 1;
    backgrounds.push(...createBackgroundSet(pos, layerNumber));
  });

  return backgrounds;
};

/**
 * Creates and initializes the complete level configuration.
 * @returns {Level} Configured level instance with all game objects
 */
const createLevel = () => {
  const bottles = createCollectiblesWithSpacing(7, () => new Bottle(), "bottle", 100);
  const coins = createCoins(bottles, 10, 100);
  const enemies = [
    ...createObjects(20, () => new Chicken()),
    ...createObjects(30, () => new Chick()),
    new Endboss(),
  ];

  return new Level({
    enemies,
    clouds: createObjects(20, () => new Cloud()),
    background: createBackgrounds(),
    bottles,
    coins,
  });
};

/**
 * Initializes level1 variable with created level.
 * @returns {void}
 */
const initLevel = () => {
  level1 = createLevel();
};
