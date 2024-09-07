"use strict";

class BottleStatusBar extends DrawableObject {
  IMAGES = [
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  percentage = 0;

  constructor() {
    super();
    this.y = 85;
    this.x = 10;
    this.width = 200;
    this.height = 60;

    this.loadImages(this.IMAGES);
    this.setPercentage(0);
  }

  /**
   * Sets the energy level displayed in the status bar.
   * @param {number} percentage - The current energy level of the bottle as a percentage.
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
    if (this.percentage == 100) {
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
