/**
 * @fileoverview Keyboard and touch input handler.
 * @description Manages keyboard and touch input events for game controls.
 * @module models/keyboard-class
 */

"use strict";

/**
 * Keyboard class that handles keyboard and touch input events.
 * @class
 */
class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  THROW = false; // KEY D
  HEAL = false; // KEY H
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
   * @returns {void}
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
      case 72:
        this.HEAL = true;
        break;
    }
  }

  /**
   * Handles key up events to set corresponding key states to false.
   * @param {KeyboardEvent} e - The keyboard event object.
   * @returns {void}
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
      case 72:
        this.HEAL = false;
        break;
    }
  }

  /**
   * Binds touch events to on-screen buttons for controlling the character.
   * Updates the corresponding key states based on touch events.
   * @returns {void}
   */
  bindTouchPressEvents() {
    const leftButton = document.getElementById("leftButton");
    const rightButton = document.getElementById("rightButton");
    const jumpButton = document.getElementById("jumpButton");
    const throwButton = document.getElementById("throwButton");
    const healButton = document.getElementById("healButton");

    if (leftButton) {
      leftButton.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.LEFT = true;
        },
        { passive: false }
      );
      leftButton.addEventListener("touchend", () => {
        this.LEFT = false;
      });
    }

    if (rightButton) {
      rightButton.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.RIGHT = true;
        },
        { passive: false }
      );
      rightButton.addEventListener("touchend", () => {
        this.RIGHT = false;
      });
    }

    if (jumpButton) {
      jumpButton.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.UP = true;
        },
        { passive: false }
      );
      jumpButton.addEventListener("touchend", () => {
        this.UP = false;
      });
    }

    if (throwButton) {
      throwButton.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.THROW = true;
        },
        { passive: false }
      );
      throwButton.addEventListener("touchend", () => {
        this.THROW = false;
      });
    }

    if (healButton) {
      healButton.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.HEAL = true;
        },
        { passive: false }
      );
      healButton.addEventListener("touchend", () => {
        this.HEAL = false;
      });
    }
  }
}
