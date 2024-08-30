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

  constructor() {
    super().loadImage("./img/5_background/layers/4_clouds/1.png");
    this.images = {};
    this.loadImages(this.IMAGES_CLAUD);
    this.x = Math.random() * 10000;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Speed optionts and Running direction.
   * Also some animations.
   */
  animate() {
    setStoppableInterval(() => this.moveLeft(), 1000 / 60);
  }
}
