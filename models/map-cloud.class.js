"use strict";

class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 300;

  IMAGES_CLAUD = [
    "./img/5_background/layers/4_clouds/1.png",
    "./img/5_background/layers/4_clouds/2.png",
    "./img/5_background/layers/4_clouds/1.png",
    "./img/5_background/layers/4_clouds/2.png",
  ];

  /**
   * Creates an instance of a cloud.
   */
  constructor() {
    super().loadImage("./img/5_background/layers/4_clouds/1.png");
    this.images = {};
    this.loadImages(this.IMAGES_CLAUD);
    this.x = Math.random() * 10000;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Animates the cloud by moving it to the left.
   * Adjusts the speed and direction of the cloud's movement.
   */
  animate() {
    setStoppableInterval(() => this.moveLeft(), 1000 / 60);
  }
}
