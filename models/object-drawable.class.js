"use strict";

class DrawableObject {
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  x = 0;
  y = 300;
  height = 150;
  width = 100;

  constructor() {
    this.images = {};
    this.img = null;
    this.currentImage = 0;
  }

  /**
   * Loads multiple images into the `images` object.
   * @param {string[]} imagePaths - An array of image paths to be loaded.
   */
  loadImages(imagePaths) {
    imagePaths.forEach((path) => {
      this.images[path] = Static.getImage(path);
    });
  }

  /**
   * Loads a single image into the `img` property.
   * @param {string} path - The path to the image to be loaded.
   */
  loadImage(path) {
    this.img = Static.getImage(path);
  }

  /**
   * Draws the current image onto the canvas at the object's position.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used for drawing.
   */
  draw(ctx) {
    ctx.save();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  /**
   * Draws a border around the object if it is an instance of specific classes.
   * This method is disabled by default and can be used for debugging.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context used for drawing.
   */
  drawFrame(ctx) {
    if (
      this instanceof ThrowableObject ||
      this instanceof Bottle ||
      this instanceof Coin ||
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof CounterStrikeChicken ||
      this instanceof Chick ||
      this instanceof Endboss
    ) {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.top - this.offset.bottom
      );

      ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * Plays an animation by cycling through the images in the given array.
   * @param {string[]} images - An array of image paths to be used for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = Static.imageCache[path];
    this.currentImage++;
  }
}
