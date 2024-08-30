"use strict";

class MovableObject extends DrawableObject {
  energy = 100;
  lastHit = 0;
  hitCooldown = 1000;
  otherDirection = false;
  speedY = 0; // Geschwindigkeit nach unten.
  acceleration = 1; // Beschleunigung

  /**
   * Berechnung des Bereiches für das jeweiliege Objekt.
   */
  isColliding(obj) {
    return (
      this.x + this.width - this.offset.right >= obj.x + obj.offset.left &&
      this.x + this.offset.left <= obj.x + obj.width - obj.offset.right &&
      this.y + this.height - this.offset.bottom >= obj.y + obj.offset.top &&
      this.y + this.offset.top <= obj.y + obj.height - obj.offset.bottom
    );
  }

  /**
   * Die Schwerkraft für den Charakter und für die Flaschen definieren.
   * Das mit größer als 0 muss sein, da die Sprung fn nur über dem Boden funktionieren soll.
   */
  applyGravity() {
    setStoppableInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 26);
  }

  /**
   * Bestätigung, ob das Objekt über dem Boden ist.
   * Confirming whether the object is above the ground.
   * Für Pepe wird immer der else-Teil der Abfrage ausgeführt.
   * @returns boolean
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 280;
    }
  }

  /**
   * Pepes Controls
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Pepes Controls
   * Also moves the clouds and the chickens.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   *
   */
  handleCharacterPushback(enemy) {
    let targetPosition;

    if (enemy instanceof Endboss) {
      targetPosition = this.x - 150;
    } else if (enemy instanceof Chicken) {
      targetPosition = this.x - 70;
    } else if (enemy instanceof CounterStrikeChicken) {
      targetPosition = this.x - 70;
    } else if (enemy instanceof Chick) {
      targetPosition = this.x - 55;
    }

    this.pushLeftSmooth(targetPosition);
  }

  /**
   *
   */
  pushLeftSmooth(targetPosition) {
    let step = 2;

    const smoothMove = () => {
      if (this.world.keyboard.LEFT) {
        return;
      }

      if (this.x > targetPosition) {
        this.x -= step;
        requestAnimationFrame(smoothMove);
      }
    };

    smoothMove();
  }

  /**
   * Nur für den Pepe, um seine beschleunigung zum Springen zu steuern.
   */
  jump() {
    this.speedY = 15;
    // this.pepeJump_sound.play();
  }

  /**
   * #1 Treffer: Pepe Lebensenergie => Pepe für eine Sekunde unverwundbar.
   * Überprüft, ob Pepe innerhalb der letzten Sekunde Schaden erlitten hat.
   * => Dann erst Treffer (this.lastHit)!
   * @returns Boolean
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * #2 Egergie: Pepe Lebensenergie => Nur jede eine Sekunde möglich Energie zu reduzieren.
   * Verursacht Schaden am Charakter und aktualisiert die Statusleiste.
   *
   * Ein Treffer wird nur gewertet, wenn die Differenz zwischen dem aktuellen Zeitpunkt und dem letzten Treffer
   * größer oder gleich dem festgelegten Abklingzeitraum (hitCooldown) ist.
   */
  hitPepe() {
    const now = Date.now();

    if (now - this.lastHit >= this.hitCooldown) {
      this.energy -= 10;
      this.lastHit = now;

      if (this.energy < 0) {
        this.energy = 0;
      }
    }
  }

  /**
   * Pepes sein sterben.
   * @returns Boolean
   */
  isDead() {
    return this.energy == 0;
  }
}
