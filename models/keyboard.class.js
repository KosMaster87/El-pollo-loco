"use strict";

class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  THROW = false; // Taste D
  COMMAND = false;
  AUDIO = false;
  RESTART = false;

  /**
   * Initializes keyboard and touch input events.
   * Sets up event listeners for keyboard and touch events.
   */
  constructor() {
    window.addEventListener("keydown", this.handleKeyDownEvent.bind(this));
    window.addEventListener("keyup", this.handleKeyUpEvent.bind(this));

    document.addEventListener(
      "DOMContentLoaded",
      this.bindTouchPressEvents.bind(this)
    );
  }

  /**
   * Handles key down events to set corresponding key states to true.
   * @param {KeyboardEvent} e - The keyboard event object.
   */
  handleKeyDownEvent(e) {
    switch (e.keyCode) {
      case 37:
        this.LEFT = true;
        break;
      case 39:
        this.RIGHT = true;
        break;
      case 38:
        this.UP = true;
        break;
      case 40:
        this.DOWN = true;
        break;
      case 32:
        this.SPACE = true;
        break;
      case 68:
        this.THROW = true;
        break;
    }
  }

  /**
   * Handles key up events to set corresponding key states to false.
   * @param {KeyboardEvent} e - The keyboard event object.
   */
  handleKeyUpEvent(e) {
    switch (e.keyCode) {
      case 37:
        this.LEFT = false;
        break;
      case 39:
        this.RIGHT = false;
        break;
      case 38:
        this.UP = false;
        break;
      case 40:
        this.DOWN = false;
        break;
      case 32:
        this.SPACE = false;
        break;
      case 68:
        this.THROW = false;
        break;
    }
  }

  /**
   * Binds touch events to on-screen buttons for controlling the character.
   * Updates the corresponding key states based on touch events.
   */
  bindTouchPressEvents() {
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");
    const jumpButton = document.getElementById("jumpButton");
    const throwButton = document.getElementById("throwButton");

    if (leftButton) {
      leftButton.addEventListener("touchstart", () => {
        this.LEFT = true;
      });
      leftButton.addEventListener("touchend", () => {
        this.LEFT = false;
      });
    }

    if (rightButton) {
      rightButton.addEventListener("touchstart", () => {
        this.RIGHT = true;
      });
      rightButton.addEventListener("touchend", () => {
        this.RIGHT = false;
      });
    }

    if (jumpButton) {
      jumpButton.addEventListener("touchstart", () => {
        this.UP = true;
      });
      jumpButton.addEventListener("touchend", () => {
        this.UP = false;
      });
    }

    if (throwButton) {
      throwButton.addEventListener("touchstart", () => {
        this.THROW = true;
      });
      throwButton.addEventListener("touchend", () => {
        this.THROW = false;
      });
    }
  }
}
