"use strict";

class BossStatusBar extends DrawableObject {
  IMAGES = [
    "./img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "./img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "./img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "./img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "./img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "./img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];

  percentage = 100;

  constructor() {
    super();
    this.y = 5;
    this.x = 500;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
  }

  /**
   * Determination of energy in the status bar.
   * @param {current energy from Pepe} percentage
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = Static.imageCache[path];
  }

  /**
   * Rating of the bar.
   * @returns number
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
