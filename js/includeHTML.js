"use strict";

/**
 * Loads an HTML page from the specified file path and inserts its content
 * into the 'w3_include' element. Displays the loaded page and manages the menu.
 *
 * @param {string} filePath - The path to the HTML file to load.
 * @returns {Promise<void>} A promise that resolves when the page is loaded.
 */
async function loadPage(filePath) {
  const w3_includeRef = document.getElementById("w3_include");
  const resp = await fetch(filePath);

  if (resp.ok) {
    w3_includeRef.innerHTML = await resp.text();

    menuPopManager();

    document.getElementById("w3_include").style.display = "flex";
  } else {
    w3_includeRef.innerHTML = "Page not found";
  }
}

/**
 * Manages the menu popup by turning it off if it is currently visible.
 */
function menuPopManager() {
  const menuPopRef = document.getElementById("menuPop");

  if (menuPopRef.style.display === "flex") {
    menuPopRef.style.display = "none";
  }
}
