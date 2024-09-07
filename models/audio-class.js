"use strict";

/**
 * Manages the game's audio, including muting, volume control, and playing sounds.
 * Initializes event listeners for volume and mute button control.
 * @constructor
 */
class AudioManager {
  constructor() {
    this.gamePaused = false;
    this.isMuted = true;
    this.soundCooldowns = {};
    this.activeSounds = new Map();
    this.volume = 1;

    document.addEventListener("DOMContentLoaded", () => {
      this.muteAll();
      this.initMuteButton();

      document.getElementById("muteButton").src =
        "./img/10_menu/volume_off.svg";

      volumeSlider.addEventListener("input", (event) => {
        const volume = event.target.value / 100;
        this.setVolume(volume);
      });

      this.setVolume(volumeSlider.value / 100);
    });

    this.sounds = {
      inHomeMusic: [
        new Audio("./audio/homeMenuSound01.mp3"),
        new Audio("./audio/homeMenuSound02.mp3"),
      ],
      inGameMusic: [new Audio("./audio/inGameSound01.mp3")],
      gameLose: [new Audio("./audio/loose.mp3")],
      gameWin: [new Audio("./audio/win.mp3")],
      walking: [
        new Audio("./audio/steps01.mp3"),
        new Audio("./audio/steps02.mp3"),
      ],
      jumping: [
        new Audio("./audio/jump01.mp3"),
        new Audio("./audio/jump02.mp3"),
        new Audio("./audio/jump03.mp3"),
        new Audio("./audio/jump04.mp3"),
      ],
      snoring: [
        new Audio("./audio/snore01.mp3"),
        new Audio("./audio/snore02.mp3"),
        new Audio("./audio/snore03.mp3"),
        new Audio("./audio/snore04.mp3"),
      ],
      hurting: [
        new Audio("./audio/hurt01.mp3"),
        new Audio("./audio/hurt02.mp3"),
        new Audio("./audio/hurt03.mp3"),
        new Audio("./audio/hurt04.mp3"),
        new Audio("./audio/hurt05.mp3"),
      ],
      death: [new Audio("./audio/deathPepe01.mp3")],
      coinEarn: [
        new Audio("./audio/coin01.mp3"),
        new Audio("./audio/coin02.mp3"),
        new Audio("./audio/coin03.mp3"),
        new Audio("./audio/coin04.mp3"),
      ],
      bottleEarn: [
        new Audio("./audio/pickSalsa01.mp3"),
        new Audio("./audio/pickSalsa02.mp3"),
      ],
      bottleThrow: [
        new Audio("./audio/throw01.mp3"),
        new Audio("./audio/throw02.mp3"),
      ],
      bottleSplash: [
        new Audio("./audio/splash01.mp3"),
        new Audio("./audio/splash02.mp3"),
        new Audio("./audio/splash03.mp3"),
        new Audio("./audio/splash04.mp3"),
      ],
      opponentDeath: [new Audio("./audio/chickenDeath01.mp3")],
      bossAttacking: [new Audio("./audio/bossAttacking01.mp3")],
      bossHurting: [new Audio("./audio/bossHurting01.mp3")],
      bossDeath: [new Audio("./audio/chickenDeath01.mp3")],
    };
  }

  /**
   * Sets the global volume for all sounds.
   * @param {number} volume - The volume level between 0 and 1.
   */
  setVolume(volume) {
    if (volume < 0 || volume > 1) {
      console.error("Volume must be between 0 and 1.");
      return;
    }
    this.volume = volume;
    this.updateAllSoundsVolume();
  }

  /**
   * Updates the volume of all currently loaded sounds to the current volume setting.
   */
  updateAllSoundsVolume() {
    for (let soundArray in this.sounds) {
      if (Array.isArray(this.sounds[soundArray])) {
        this.sounds[soundArray].forEach(
          (sound) => (sound.volume = this.volume)
        );
      }
    }
  }

  /**
   * Initializes the mute button, adding a click event listener to toggle sound mute.
   */
  initMuteButton() {
    const muteButton = document.getElementById("muteButton");
    muteButton.addEventListener("click", this.toggleMute.bind(this));
  }

  /**
   * Toggles the mute state of all sounds and updates the mute button icon accordingly.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.muteAll();
      this.updateMuteButtonIcon("volume_off");
    } else {
      this.unmuteAll();
      this.updateMuteButtonIcon("volume_up");
    }
  }

  /**
   * Updates the icon of the mute button based on the mute state.
   * @param {string} icon - The name of the icon to display ('volume_off' or 'volume_up').
   */
  updateMuteButtonIcon(icon) {
    const muteButton = document.getElementById("muteButton");
    muteButton.src = `./../img/10_menu/${icon}.svg`;
  }

  /**
   * Mutes all sounds by setting their volume to 0.
   */
  muteAll() {
    for (let soundArray in this.sounds) {
      if (Array.isArray(this.sounds[soundArray])) {
        this.sounds[soundArray].forEach((sound) => (sound.volume = 0));
      }
    }
  }

  /**
   * Unmutes all sounds by restoring their volume to the current global setting.
   */
  unmuteAll() {
    for (let soundArray in this.sounds) {
      if (Array.isArray(this.sounds[soundArray])) {
        this.sounds[soundArray].forEach((sound) => (sound.volume = 1));
      }
    }
  }

  /**
   * Plays the sound associated with the provided key if it's not on cooldown and not currently playing.
   * @param {string} soundKey - The key of the sound to play.
   */
  playSound(soundKey) {
    const now = Date.now();
    const cooldown = 800;

    if (
      this.sounds[soundKey] &&
      (!this.soundCooldowns[soundKey] ||
        now - this.soundCooldowns[soundKey] >= cooldown) &&
      !this.isSoundPlaying(soundKey)
    ) {
      if (Array.isArray(this.sounds[soundKey])) {
        this.stopAllSounds(this.sounds[soundKey]);
        this.playRandomSound(this.sounds[soundKey], soundKey);
      }
      this.soundCooldowns[soundKey] = now;
    }
  }

  /**
   * Plays a random sound from the given array of sounds.
   * @param {Array<Audio>} soundArray - The array of sounds to play from.
   * @param {string} soundKey - The key associated with the sound.
   */
  playRandomSound(soundArray, soundKey) {
    const randomIndex = Math.floor(Math.random() * soundArray.length);
    const sound = soundArray[randomIndex];

    if (sound instanceof Audio) {
      this.stopAllSounds(soundArray);
      sound.currentTime = 0;
      sound.play();
      this.activeSounds.set(soundKey, sound);
      sound.addEventListener("ended", () => {
        this.activeSounds.delete(soundKey);
      });
    }
  }

  /**
   * Checks if a sound is currently playing.
   * @param {string} soundKey - The key of the sound to check.
   * @returns {boolean} - True if the sound is currently playing, false otherwise.
   */
  isSoundPlaying(soundKey) {
    return this.activeSounds.has(soundKey);
  }

  /**
   * Stops all sounds in the provided array.
   * @param {Array<Audio>} soundArray - The array of sounds to stop.
   */
  stopAllSounds(soundArray) {
    soundArray.forEach((sound) => {
      if (sound instanceof Audio && !sound.paused) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }

  /**
   * Stops the sound associated with the provided key if it's currently playing.
   * @param {string} soundName - The name of the sound to stop.
   */
  stopSound(soundName) {
    if (this.isSoundPlaying(soundName)) {
      this.activeSounds.get(soundName).pause();
      this.activeSounds.delete(soundName);
    }
  }
}
