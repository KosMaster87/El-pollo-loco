/**
 * @fileoverview Asset preloading utilities
 * @description Handles preloading of images, audio, and fonts for the game with iOS/Safari compatibility
 * @module js/preloader
 */

"use strict";

/**
 * Preloads all game assets including images, audio, and fonts.
 * @returns {Promise<void>} Promise resolving when all assets are loaded
 */
async function preloadAssets() {
  const imagesToLoad = [
    "./assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "./assets/img/2_character_pepe/1_idle/idle/I-10.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
    "./assets/img/2_character_pepe/2_walk/W-21.png",
    "./assets/img/2_character_pepe/2_walk/W-22.png",
    "./assets/img/2_character_pepe/2_walk/W-23.png",
    "./assets/img/2_character_pepe/2_walk/W-24.png",
    "./assets/img/2_character_pepe/2_walk/W-25.png",
    "./assets/img/2_character_pepe/2_walk/W-26.png",
    "./assets/img/2_character_pepe/3_jump/J-31.png",
    "./assets/img/2_character_pepe/3_jump/J-32.png",
    "./assets/img/2_character_pepe/3_jump/J-33.png",
    "./assets/img/2_character_pepe/3_jump/J-34.png",
    "./assets/img/2_character_pepe/3_jump/J-35.png",
    "./assets/img/2_character_pepe/3_jump/J-36.png",
    "./assets/img/2_character_pepe/3_jump/J-37.png",
    "./assets/img/2_character_pepe/3_jump/J-38.png",
    "./assets/img/2_character_pepe/3_jump/J-39.png",
    "./assets/img/2_character_pepe/4_hurt/H-41.png",
    "./assets/img/2_character_pepe/4_hurt/H-42.png",
    "./assets/img/2_character_pepe/4_hurt/H-43.png",
    "./assets/img/2_character_pepe/5_dead/D-51.png",
    "./assets/img/2_character_pepe/5_dead/D-52.png",
    "./assets/img/2_character_pepe/5_dead/D-53.png",
    "./assets/img/2_character_pepe/5_dead/D-54.png",
    "./assets/img/2_character_pepe/5_dead/D-55.png",
    "./assets/img/2_character_pepe/5_dead/D-56.png",
    "./assets/img/2_character_pepe/5_dead/D-57.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    "./assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "./assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    "./assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "./assets/img/4_enemie_boss_chicken/1_walk/G4.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "./assets/img/4_enemie_boss_chicken/2_alert/G12.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "./assets/img/4_enemie_boss_chicken/3_attack/G20.png",
    "./assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
    "./assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "./assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "./assets/img/4_enemie_boss_chicken/5_dead/G26.png",
    "./assets/img/5_background/layers/1_first_layer/1.png",
    "./assets/img/5_background/layers/1_first_layer/2.png",
    "./assets/img/5_background/layers/2_second_layer/1.png",
    "./assets/img/5_background/layers/2_second_layer/2.png",
    "./assets/img/5_background/layers/3_third_layer/1.png",
    "./assets/img/5_background/layers/3_third_layer/2.png",
    "./assets/img/5_background/layers/4_clouds/1.png",
    "./assets/img/5_background/layers/4_clouds/2.png",
    "./assets/img/5_background/layers/air.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "./assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    "./assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    "./assets/img/6_salsa_bottle/salsa_bottle.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
    "./assets/img/7_statusbars/3_icons/icon_coin.png",
    "./assets/img/7_statusbars/3_icons/icon_health_endboss.png",
    "./assets/img/7_statusbars/3_icons/icon_health.png",
    "./assets/img/7_statusbars/3_icons/icon_salsa_bottle.png",
    "./assets/img/8_coin/coin_1.png",
    "./assets/img/8_coin/coin_2.png",
    "./assets/img/9_intro_outro_screens/game_over/youWin.png",
    "./assets/img/9_intro_outro_screens/game_over/youLose.png",
    "./assets/img/9_intro_outro_screens/start/startscreen_1.png",
    "./assets/img/9_intro_outro_screens/start/startscreen_2.png",
    "./assets/img/desert.png",
    "./assets/img/desertBackground.jpg",
  ];

  const audioToLoad = [
    "./assets/audio/homeMenuSound01.mp3",
    "./assets/audio/homeMenuSound02.mp3",
    "./assets/audio/inGameSound01.mp3",
    "./assets/audio/chickenDeath01.mp3",
    "./assets/audio/bossHurting01.mp3",
    "./assets/audio/bossAttacking01.mp3",
    "./assets/audio/coin01.mp3",
    "./assets/audio/coin02.mp3",
    "./assets/audio/coin03.mp3",
    "./assets/audio/coin04.mp3",
    "./assets/audio/deathPepe01.mp3",
    "./assets/audio/hurt01.mp3",
    "./assets/audio/hurt02.mp3",
    "./assets/audio/hurt03.mp3",
    "./assets/audio/hurt04.mp3",
    "./assets/audio/hurt05.mp3",
    "./assets/audio/jump01.mp3",
    "./assets/audio/jump02.mp3",
    "./assets/audio/jump03.mp3",
    "./assets/audio/jump04.mp3",
    "./assets/audio/snore01.mp3",
    "./assets/audio/snore02.mp3",
    "./assets/audio/snore03.mp3",
    "./assets/audio/snore04.mp3",
    "./assets/audio/steps01.mp3",
    "./assets/audio/steps02.mp3",
    "./assets/audio/pickSalsa01.mp3",
    "./assets/audio/pickSalsa02.mp3",
    "./assets/audio/splash01.mp3",
    "./assets/audio/splash02.mp3",
    "./assets/audio/splash03.mp3",
    "./assets/audio/splash04.mp3",
    "./assets/audio/throw01.mp3",
    "./assets/audio/throw02.mp3",
    "./assets/audio/win.mp3",
    "./assets/audio/loose.mp3",
  ];

  const fontsToLoad = [
    new FontFace(
      "Comic Neue",
      "url(./assets/fonts/comic/comic-neue-v8-latin-300.woff2)",
      { weight: "300", style: "normal" }
    ),
    new FontFace(
      "Comic Neue",
      "url(./assets/fonts/comic/comic-neue-v8-latin-300italic.woff2)",
      { weight: "300", style: "italic" }
    ),
    new FontFace(
      "Comic Neue",
      "url(./assets/fonts/comic/comic-neue-v8-latin-regular.woff2)",
      { weight: "400", style: "normal" }
    ),
    new FontFace(
      "Comic Neue",
      "url(./assets/fonts/comic/comic-neue-v8-latin-italic.woff2)",
      { weight: "400", style: "italic" }
    ),
    new FontFace(
      "Comic Neue",
      "url(./assets/fonts/comic/comic-neue-v8-latin-700.woff2)",
      { weight: "700", style: "normal" }
    ),
    new FontFace(
      "Comic Neue",
      "url(./assets/fonts/comic/comic-neue-v8-latin-700italic.woff2)",
      { weight: "700", style: "italic" }
    ),
  ];

  Static.preloadImages(imagesToLoad);
  Static.preloadAudio(audioToLoad);
  Static.preloadFonts(fontsToLoad);

  await preloadImages(imagesToLoad);
  await preloadAudio(audioToLoad);
  await preloadFonts(fontsToLoad);
}

/**
 * Preloads a set of images.
 * @param {string[]} paths - Array of image file paths to preload
 * @returns {Promise<HTMLImageElement[]>} Promise resolving with loaded images
 */
const preloadImages = (paths) => {
  return Promise.all(paths.map((path) => loadSingleImage(path)));
};

/**
 * Loads a single image file.
 * @param {string} path - Image file path to load
 * @returns {Promise<HTMLImageElement>} Promise resolving with loaded image element
 */
const loadSingleImage = (path) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      Static.imageCache[path] = img;
      resolve(img);
    };
    img.onerror = reject;
  });
};

/**
 * Preloads a set of audio files with iOS/Safari compatibility.
 * @param {string[]} paths - Array of audio file paths to preload
 * @returns {Promise<HTMLAudioElement[]>} Promise resolving with preloaded audio elements
 */
const preloadAudio = (paths) => {
  return Promise.all(paths.map((path) => loadSingleAudio(path)));
};

/**
 * Loads a single audio file with timeout fallback for iOS/Safari.
 * @param {string} path - Audio file path to load
 * @returns {Promise<HTMLAudioElement>} Promise resolving with loaded audio element
 */
const loadSingleAudio = (path) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = path;
    let resolved = false;

    const timeout = setTimeout(
      () => resolveAudio(audio, path, resolved, resolve, timeout),
      2000
    );
    audio.oncanplaythrough = () =>
      resolveAudio(audio, path, resolved, resolve, timeout);
    audio.onerror = () => resolveAudio(audio, path, resolved, resolve, timeout);
  });
};

/**
 * Resolves audio loading promise and caches the audio.
 * @param {HTMLAudioElement} audio - Audio element to cache
 * @param {string} path - Audio file path for caching key
 * @param {boolean} resolved - Flag to prevent double resolution
 * @param {Function} resolve - Promise resolve function
 * @param {number} timeout - Timeout ID to clear
 */
const resolveAudio = (audio, path, resolved, resolve, timeout) => {
  if (!resolved) {
    resolved = true;
    clearTimeout(timeout);
    Static.audioCache[path] = audio;
    resolve(audio);
  }
};

/**
 * Preloads a set of fonts.
 * @param {FontFace[]} fonts - Array of FontFace objects to preload
 * @returns {Promise<void[]>} Promise resolving when all fonts are loaded
 */
const preloadFonts = (fonts) => {
  return Promise.all(fonts.map((font) => loadSingleFont(font)));
};

/**
 * Loads a single font and adds it to the document.
 * @param {FontFace} font - FontFace object to load
 * @returns {Promise<void>} Promise resolving when font is loaded
 */
const loadSingleFont = (font) => {
  return font.load().then((loadedFont) => {
    Static.fontCache[font.family] = loadedFont;
    document.fonts.add(loadedFont);
  });
};
