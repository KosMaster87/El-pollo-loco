"use strict";

class Static {
  static imageCache = {};
  static audioCache = {};
  static fontCache = {};

  /**
   * Preloads an array of image paths into the image cache.
   * @param {Array<string>} paths - The paths of the images to be preloaded.
   */
  static preloadImages(paths) {
    paths.forEach((path) => {
      if (!this.imageCache[path]) {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      }
    });
  }

  /**
   * Preloads an array of audio paths into the audio cache.
   * @param {Array<string>} paths - The paths of the audio files to be preloaded.
   */
  static preloadAudio(paths) {
    paths.forEach((path) => {
      if (!this.audioCache[path]) {
        let mp3 = new Audio();
        mp3.src = path;
        this.audioCache[path] = mp3;
      }
    });
  }

  /**
   * Preloads an array of FontFace objects into the font cache.
   * @param {Array<FontFace>} fonts - The FontFace objects to be preloaded.
   */
  static preloadFonts(fonts) {
    fonts.forEach((font) => {
      if (!this.fontCache[font.family]) {
        this.fontCache[font.family] = font
          .load()
          .then((loadedFont) => {
            document.fonts.add(loadedFont);
            return loadedFont;
          })
          .catch((error) => {
            console.error(`Error loading font ${font.family}:`, error);
          });
      }
    });
  }

  /**
   * Retrieves an image from the cache.
   * @param {string} path - The path of the image to retrieve.
   * @returns {HTMLImageElement} - The cached image element.
   */
  static getImage(path) {
    return this.imageCache[path];
  }

  /**
   * Retrieves an audio file from the cache.
   * @param {string} path - The path of the audio file to retrieve.
   * @returns {HTMLAudioElement} - The cached audio element.
   */
  static getAudio(path) {
    return this.audioCache[path];
  }

  /**
   * Retrieves a font from the cache.
   * @param {string} family - The font family to retrieve.
   * @returns {FontFace} - The cached FontFace object.
   */
  static getFont(family) {
    return this.fontCache[family];
  }
}
