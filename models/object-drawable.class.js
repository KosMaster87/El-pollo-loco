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

  loadImages(imagePaths) {
    imagePaths.forEach((path) => {
      this.images[path] = Static.getImage(path);
    });
  }

  loadImage(path) {
    this.img = Static.getImage(path);
  }

  /**
   * Here the images to be drawn are drawn onto the canvas.
   * @param {each movable object} ctx
   */
  draw(ctx) {
    ctx.save();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  /**
   * Is disabled by default.
   * "InstanceOf" means that only the objects marked in the if condition get the border.
   * And that only applies to the drawable-object.class.js, since it is also referred to as "this" here.
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
   * Play an animation by cycling through the images in the given array.
   * @param {Array of image paths} images
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = Static.imageCache[path];
    this.currentImage++;
  }
}
