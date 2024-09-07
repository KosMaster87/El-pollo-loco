"use strict";

class Coin extends MovableObject {
  offset = {
    top: 35,
    bottom: 35,
    left: 35,
    right: 35,
  };

  IMAGES_COIN = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];

  /**
   * Creates an instance of a coin.
   * The coin's position is randomly assigned within a specified range.
   */
  constructor() {
    super().loadImage("./img/8_coin/coin_1.png");
    this.images = {};
    this.loadImages(this.IMAGES_COIN);
    const minY = 150;
    const maxY = 300;
    this.x = 100 + Math.random() * 720 * 4;
    this.y = minY + Math.random() * (maxY - minY);
    this.width = 100;
    this.height = 100;
    this.animate();
  }

  /**
   * Animates the coin by cycling through its images.
   */
  animate() {
    setStoppableInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 220);
  }
}
