"use strict";

class PickableObject extends DrawableObject {
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  isColliding(obj) {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left &&
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top &&
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom
    );
  }
}
