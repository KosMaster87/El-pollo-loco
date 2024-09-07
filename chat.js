/**
 * Offset values for the character's bounding box.
 * @type {Object}
 * @property {number} top - Top offset value.
 * @property {number} bottom - Bottom offset value.
 * @property {number} left - Left offset value.
 * @property {number} right - Right offset value.
 */
offset = {
  top: 80,
  bottom: 10,
  left: 20,
  right: 20,
};

/**
 * Number of bottles the character have.
 * @type {number}
 */
bottles = [];

/**
 * Number of coins the character have.
 * @type {number}
 */
coins = [];

/**
 * Maximum number of bottles the character can carry.
 * @type {number}
 */
maxBottles = 5;

/**
 * Maximum number of coins the character can carry.
 * @type {number}
 */
maxCoins = 5;

/**
 * Initial character dimensions and position.
 * @type {number}
 */
height = 170;
width = 95;
x = 0;
y = 270;

/**
 * Character's speed.
 * @type {number}
 */
speed = 5;

/**
 * Tracks the idle start state of the character.
 * @type {boolean}
 */
idleStart;

/**
 * Tracks the sleeping start state of the character.
 * @type {boolean}
 */
sleepStart;

/**
 * Tracks the idle state of the character.
 * @type {boolean}
 */
idle = false;

/**
 * Tracks the sleeping state of the character.
 * @type {boolean}
 */
sleep = false;

/**
 * The last enemy that Pepe collided with.
 * @type {Object|null}
 */
lastCollidedEnemy = null;
