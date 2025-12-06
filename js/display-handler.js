/**
 * @fileoverview Display and orientation management.
 * @description Handles responsive display adjustments and orientation changes for different devices.
 * @module js/display-handler
 */

"use strict";

/**
 * Responsive breakpoints for different device types.
 * @constant {Object}
 */
const BREAKPOINTS = {
  MOBILE_SMALL: 375, // Small phones (iPhone SE, etc.)
  MOBILE_MEDIUM: 428, // Standard phones (iPhone 14 Pro, etc.)
  MOBILE_LARGE: 667, // Large phones / small phones landscape
  TABLET_SMALL: 768, // Small tablets portrait (iPad Mini)
  TABLET_MEDIUM: 834, // Medium tablets portrait (iPad Air)
  TABLET_LARGE: 1024, // Large tablets portrait (iPad Pro 11")
  DESKTOP_SMALL: 1366, // Small laptops / tablets landscape
  DESKTOP_MEDIUM: 1920, // Standard desktop screens
  DESKTOP_LARGE: 2560, // Large desktop screens / 4K
};

/**
 * Checks if the current device is in landscape orientation.
 * @returns {boolean} - True if the device is in landscape orientation, otherwise false.
 */
const isLandscapeOrientation = () => {
  return window.matchMedia("(orientation: landscape)").matches;
};

/**
 * Returns the current width of the browser window.
 * @returns {number} - The width of the window in pixels.
 */
const getScreenWidth = () => window.innerWidth;

/**
 * Determines the device category based on screen width and orientation.
 * @param {number} width - The width of the screen in pixels.
 * @param {boolean} isLandscape - Whether the device is in landscape orientation.
 * @returns {string} - Device category identifier.
 */
const getDeviceCategory = (width, isLandscape) => {
  if (isLandscape) {
    if (width <= BREAKPOINTS.MOBILE_LARGE) return "phone-landscape";
    if (width <= BREAKPOINTS.TABLET_LARGE) return "tablet-landscape";
    if (width <= BREAKPOINTS.DESKTOP_SMALL) return "laptop-small";
    if (width <= BREAKPOINTS.DESKTOP_MEDIUM) return "desktop-standard";
    return "desktop-large";
  } else {
    if (width <= BREAKPOINTS.MOBILE_SMALL) return "phone-small";
    if (width <= BREAKPOINTS.MOBILE_MEDIUM) return "phone-medium";
    if (width <= BREAKPOINTS.MOBILE_LARGE) return "phone-large";
    if (width <= BREAKPOINTS.TABLET_SMALL) return "tablet-small";
    if (width <= BREAKPOINTS.TABLET_MEDIUM) return "tablet-medium";
    if (width <= BREAKPOINTS.TABLET_LARGE) return "tablet-large";
    return "desktop-portrait";
  }
};

/**
 * Checks if the current device is a mobile device.
 * @returns {boolean} - True if device is mobile, otherwise false.
 */
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Main function to adjust display elements based on width and orientation.
 * Called on resize, orientation change, and page load.
 * @returns {void}
 */
const adjustDisplayBasedOnWidthAndOrientation = () => {
  const rotateLayerRef = document.getElementById("rotateLayer");
  const mobileControlHubRef = document.getElementById("mobileControlHub");
  const width = getScreenWidth();
  const isLandscape = isLandscapeOrientation();

  if (isLandscape) {
    handleLandscapeMode(width, rotateLayerRef, mobileControlHubRef);
  } else {
    handlePortraitMode(width, rotateLayerRef, mobileControlHubRef);
  }
};

/**
 * Handles the display of elements when the device is in landscape mode.
 * Triggers minimal UI mode for mobile devices.
 * @param {number} width - The width of the screen in pixels.
 * @param {HTMLElement} rotateLayerRef - Reference to the rotate layer element.
 * @param {HTMLElement} mobileControlHubRef - Reference to the mobile control hub element.
 * @returns {void}
 */
const handleLandscapeMode = (width, rotateLayerRef, mobileControlHubRef) => {
  const deviceCategory = getDeviceCategory(width, true);
  rotateLayerRef.style.display = "none";

  // Show mobile controls for phones and tablets in landscape
  const showControls = [
    "phone-landscape",
    "tablet-landscape",
    "laptop-small",
  ].includes(deviceCategory);

  mobileControlHubRef.style.display =
    showControls && gameStartetOnce && isGameRunning ? "flex" : "none";
};

/**
 * Handles the display of elements when the device is in portrait mode.
 * @param {number} width - The width of the screen in pixels.
 * @param {HTMLElement} rotateLayerRef - Reference to the rotate layer element.
 * @param {HTMLElement} mobileControlHubRef - Reference to the mobile control hub element.
 * @returns {void}
 */
const handlePortraitMode = (width, rotateLayerRef, mobileControlHubRef) => {
  const deviceCategory = getDeviceCategory(width, false);
  mobileControlHubRef.style.display = "none";

  // Show rotate prompt only for phones in portrait mode
  const showRotatePrompt = [
    "phone-small",
    "phone-medium",
    "phone-large",
  ].includes(deviceCategory);

  rotateLayerRef.style.display = showRotatePrompt ? "flex" : "none";
};

/**
 * Initializes event listeners for responsive display adjustments.
 * Listens to window resize and orientation change events.
 * @returns {void}
 */
const initDisplayHandlers = () => {
  window.addEventListener("resize", adjustDisplayBasedOnWidthAndOrientation);
  window.addEventListener("orientationchange", () => {
    // Small delay to ensure orientation change is complete
    setTimeout(adjustDisplayBasedOnWidthAndOrientation, 100);
  });

  document.addEventListener(
    "DOMContentLoaded",
    adjustDisplayBasedOnWidthAndOrientation
  );
};

// Initialize display handlers
initDisplayHandlers();
