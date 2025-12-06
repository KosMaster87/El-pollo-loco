/**
 * @fileoverview Handler for healing mechanics in the game.
 * @description Manages character healing and UI prompts.
 * @module models/heal-handler
 */

"use strict";

/**
 * Handles healing logic and UI updates.
 * @class
 */
class HealHandler {
  lastHealTime = 0;
  healCooldown = 500;

  /**
   * Creates a new HealHandler instance.
   * @param {World} world - Reference to the world instance
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks if the heal key is pressed and triggers healing.
   */
  checkHealAction = () => {
    const now = Date.now();

    if (this.canHeal(now)) {
      this.world.character.heal();
      this.updateStatusBarsAfterHeal();
      this.lastHealTime = now;
    }
  };

  /**
   * Checks if the character can heal.
   * @param {number} now - Current timestamp
   * @returns {boolean} True if character can heal
   */
  canHeal = (now) => {
    return (
      this.world.keyboard.HEAL &&
      this.world.character.coins.length >= 5 &&
      this.world.character.energy < 100 &&
      now - this.lastHealTime >= this.healCooldown
    );
  };

  /**
   * Updates status bars after healing.
   */
  updateStatusBarsAfterHeal = () => {
    this.world.statusBarPepe.setPercentage(this.world.character.energy);
    this.world.statusBarCoin.setPercentage(0);
  };

  /**
   * Shows or hides the heal prompt based on conditions.
   */
  updateHealPrompt = () => {
    if (!this.isMobile()) {
      const canHeal = this.canShowHealPrompt();
      const healPromptDesktop = document.getElementById("healPromptDesktop");
      if (healPromptDesktop) {
        healPromptDesktop.style.display = canHeal ? "block" : "none";
      }
    }
  };

  /**
   * Checks if heal prompt should be shown.
   * @returns {boolean} True if heal prompt should be shown
   */
  canShowHealPrompt = () => {
    return (
      this.world.character.coins.length >= 5 &&
      this.world.character.energy < 100
    );
  };

  /**
   * Checks if the device is mobile.
   * @returns {boolean} True if device is mobile
   */
  isMobile = () => {
    return (
      window.innerWidth <= 667 ||
      (window.innerWidth <= 1080 &&
        window.matchMedia("(orientation: landscape)").matches)
    );
  };
}
