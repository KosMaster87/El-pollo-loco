class AudioManager {
  constructor() {
    this.gamePaused = false;
    this.isMuted = true;
    this.soundCooldowns = {};
    this.activeSounds = new Map();
    document.addEventListener("DOMContentLoaded", () => {
      this.togglePlayPauseEvent();
      this.muteAll();
      document.getElementById("muteButton").src =
        "./img/10_menu/volume_off.svg";
    });

    this.sounds = {
      inHomeMusic: [
        new Audio("./audio/homeMenuSound01.mp3"),
        new Audio("./audio/homeMenuSound02.mp3"),
      ],
      inGameMusic: [
        new Audio("./audio/inGameSound01.mp3"),
        // new Audio("./audio/loose.mp3"),
      ],
      gameLose: [
        new Audio("./audio/loose.mp3"),
        // new Audio("./audio/loose.mp3"),
      ],
      gameWin: [
        new Audio("./audio/win.mp3"),
        // new Audio("./audio/win.mp3")
      ],
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
      death: [
        new Audio("./audio/deathPepe01.mp3"),
        // new Audio("./audio/deathPepe02.mp3"),
      ],
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
      opponentDeath: [
        new Audio("./audio/chickenDeath01.mp3"),
        new Audio("./audio/chickenDeath02.mp3"),
      ],
      bossAttacking: [
        new Audio("./audio/bossAttacking01.mp3"),
        // new Audio("./audio/chickenDeath2.mp3"),
      ],
      bossHurting: [
        new Audio("./audio/bossHurting01.mp3"),
        // new Audio("./audio/chickenDeath02.mp3"),
      ],
      bossDeath: [
        new Audio("./audio/chickenDeath01.mp3"),
        // new Audio("./audio/chickenDeath02.mp3"),
      ],
    };
  }

  muteAll() {
    for (let soundArray in this.sounds) {
      if (Array.isArray(this.sounds[soundArray])) {
        // console.log(this.sounds[soundArray]);
        this.sounds[soundArray].forEach((sound) => (sound.volume = 0));
      }
    }
  }

  unmuteAll() {
    for (let soundArray in this.sounds) {
      if (Array.isArray(this.sounds[soundArray])) {
        this.sounds[soundArray].forEach((sound) => (sound.volume = 1));
      }
    }
  }

  togglePlayPauseEvent() {
    const playPauseButton = document.getElementById("playPauseButton");
    const muteButton = document.getElementById("muteButton");

    if (playPauseButton && muteButton) {
      playPauseButton.addEventListener(
        "click",
        this.togglePlayPause.bind(this)
      );
      muteButton.addEventListener("click", this.toggleMute.bind(this));
    } else {
      console.error("Buttons not found in the DOM");
    }
  }

  togglePlayPause() {
    this.gamePaused = !this.gamePaused;

    if (this.gamePaused) {
      pauseAllIntervals();
    } else {
      resumeAllIntervals();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.muteAll();
      document.getElementById("muteButton").src =
        "./img/10_menu/volume_off.svg";
    } else {
      this.unmuteAll();
      document.getElementById("muteButton").src = "./img/10_menu/volume_up.svg";
    }
  }

  /**
   * Spielt den Sound nur ab, wenn der Cooldown abgelaufen ist.
   * @param {string} soundKey
   */
  playSound(soundKey) {
    const now = Date.now();
    const cooldown = 800;

    if (
      this.sounds[soundKey] &&
      (!this.soundCooldowns[soundKey] ||
        now - this.soundCooldowns[soundKey] >= cooldown) &&
      !this.isSoundPlaying(soundKey) // Überprüfe, ob der Sound bereits abgespielt wird
    ) {
      if (Array.isArray(this.sounds[soundKey])) {
        this.stopAllSounds(this.sounds[soundKey]);
        this.playRandomSound(this.sounds[soundKey], soundKey);
      }
      this.soundCooldowns[soundKey] = now;
    }
  }

  playRandomSound(soundArray, soundKey) {
    const randomIndex = Math.floor(Math.random() * soundArray.length);
    const sound = soundArray[randomIndex];

    if (sound instanceof Audio) {
      this.stopAllSounds(soundArray);
      sound.currentTime = 0;
      sound.play();
      this.activeSounds.set(soundKey, sound); // Sound als aktiv markieren

      // Entferne den Sound, wenn er beendet ist
      sound.addEventListener("ended", () => {
        this.activeSounds.delete(soundKey);
      });
    }
  }

  isSoundPlaying(soundKey) {
    return this.activeSounds.has(soundKey);
  }

  stopAllSounds(soundArray) {
    soundArray.forEach((sound) => {
      if (sound instanceof Audio && !sound.paused) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }

  stopSound(soundName) {
    if (this.isSoundPlaying(soundName)) {
      this.activeSounds.get(soundName).pause();
      this.activeSounds.delete(soundName);
    }
  }

  // playSound(soundKey) {
  //   const now = Date.now();
  //   const cooldown = 800;

  //   if (
  //     this.sounds[soundKey] &&
  //     (!this.soundCooldowns[soundKey] ||
  //       now - this.soundCooldowns[soundKey] >= cooldown)
  //   ) {
  //     if (Array.isArray(this.sounds[soundKey])) {
  //       this.stopAllSounds(this.sounds[soundKey]);
  //       this.playRandomSound(this.sounds[soundKey]);
  //     }
  //     this.soundCooldowns[soundKey] = now;
  //   }
  // }

  // playRandomSound(soundArray) {
  //   const randomIndex = Math.floor(Math.random() * soundArray.length);
  //   const sound = soundArray[randomIndex];

  //   if (sound instanceof Audio) {
  //     this.stopAllSounds(soundArray);
  //     sound.currentTime = 0;
  //     sound.play();
  //   }
  // }

  // stopAllSounds(soundArray) {
  //   soundArray.forEach((sound) => {
  //     sound.pause();
  //     sound.currentTime = 0;
  //   });
  // }
}
