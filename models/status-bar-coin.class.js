/**
 * @fileoverview Coin status bar class.
 * @description Manages the visual coin inventory status bar.
 * @module models/status-bar-coin-class
 */

"use strict";

/**
 * Coin status bar class to display coin inventory.
 * @class
 * @extends {DrawableObject}
 */
class CoinStatusBar extends DrawableObject {
  IMAGES = [
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  percentage = 0;

  constructor() {
    super();
    this.y = 35;
    this.x = 10;
    this.width = 200;
    this.height = 60;

    this.loadImages(this.IMAGES);
    this.setPercentage(0);
  }

  /**
   * Sets the coin count displayed in the status bar.
   * @param {number} percentage - The current number of coins as a percentage.
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = Static.getImage(path);
  }

  /**
   * Determines the index of the image to display based on the percentage.
   * @returns {number} The index of the image in the IMAGES array.
   */
  resolveImageIndex() {
    if (this.percentage === 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
