"use strict";

class Bottle extends PickableObject {
  IMAGES_SALSA_GROUND = [
    "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  /**
   * Creates an instance of a bottle.
   * @param {number} [x] - The x-coordinate position of the bottle. If not provided, a random value will be used.
   * @param {number} [y] - The y-coordinate position of the bottle. If not provided, a random value will be used.
   */
  constructor(x, y) {
    super().loadImage("./img/6_salsa_bottle/salsa_bottle.png");
    this.images = {};
    this.loadImages(this.IMAGES_SALSA_GROUND);
    this.x = x || 100 + Math.random() * 720 * 4;
    this.y = y || 370 + Math.random();
    this.width = 50;
    this.height = 60;
    this.animate();
  }

  /**
   * Animate the bottle by playing the salsa ground images.
   */
  animate() {
    setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_SALSA_GROUND);
    }, 220);
  }
}
