"use strict";

class World {
  level;
  endBossRef;
  character;

  ctx;
  canvas;
  keyboard;
  camera_x = 0;

  statusBarBoss = new BossStatusBar();
  statusBarPepe = new CharacterStatusBar();
  statusBarCoin = new CoinStatusBar();
  statusBarBottle = new BottleStatusBar();

  throwableObjects = [];
  lastThrowTime = 0;
  throwCooldown = 500;

  activeEnemyInteraction = false;
  bossAttackStartTime = null;
  counterStrikeChickens = [];

  constructor(canvas, keyboard, audioManager, staticInstance) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audioManager = audioManager;
    this.staticInstance = staticInstance;
    this.level = level1;
    this.assignWorldToCharacter();
    this.assignWorldToEnemies();
    this.endBossRef = this.setBossRef();
    this.draw();
    this.run();
  }

  assignWorldToCharacter() {
    this.character = new Character(this.audioManager, this.staticInstance);
    this.character.world = this;
  }

  assignWorldToEnemies() {
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      enemy.audioManager = this.audioManager;
      enemy.staticInstance = this.staticInstance;
    });
  }

  setBossRef() {
    return this.level.enemies.find((enemy) => enemy instanceof Endboss);
  }

  /**
   * Prüft die Zeitvorgabe für Kolusion von Pepe mit den Feinden.
   * Sowie auch die Berührung der Flaschen.
   */
  run() {
    if (isGameRunning) {
      setStoppableInterval(() => {
        this.checkCollisions();
      }, 50);

      setStoppableInterval(() => {
        this.applyDamageToCharacter();
      }, 50);

      setStoppableInterval(() => {
        this.throwObject();
      }, 200);

      setStoppableInterval(() => {
        this.checkAlerts();
      }, 200);
    }
  }

  /**
   * Durch hit_Boss() wird der Counter-Strike getriggert.
   * Und hier wird der Zeitpunkt des Erscheinens festgelegt.
   */
  scheduleChickenSpawn() {
    setTimeout(() => {
      this.spawnChickens();
    }, 500);
  }

  /**
   *
   */
  spawnChickens() {
    this.counterStrikeChickens = this.createObjects(
      5,
      () => new CounterStrikeChicken(this.endBossRef)
    );

    this.counterStrikeChickens.forEach((chicken, index) => {
      chicken.world = this;
      chicken.spawnRightPlace(index);
      chicken.startAttackPhase();
    });

    this.level.enemies.push(...this.counterStrikeChickens);
  }

  /**
   *
   */
  createObjects(count, createFunc) {
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(createFunc());
    }

    return objects;
  }

  /**
   * Check if Pepe collision with Objects.
   */
  checkCollisions() {
    this.enemieStatusRelationPepe();
    this.checkBottleStatusToEarn();
    this.checkCoinStatusToEarn();
    this.checkThrowableObjectCollisions();
  }

  /**
   * Simples auslesen des Momentanen Zustand des Schadens selber.
   * Simply read out the current state of the damage itself.
   * @returns Bolean
   */
  applyDamageToCharacter() {
    if (this.activeEnemyInteraction) {
      return;
    }

    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (!enemy.isDead()) {
          this.activeEnemyInteraction = true;
          this.character.hitPepe();
          this.statusBarPepe.setPercentage(this.character.energy);
          this.character.handleCharacterPushback(enemy);

          setTimeout(() => {
            this.activeEnemyInteraction = false;
          }, 200);
        }
      }
    });
  }

  /**
   * Bislang nur für den Boss gedacht.
   */
  checkAlerts() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.checkDistanceToCharacter(this.character);
      }
    });
  }

  /**
   * Hier ist der Umfang der kollidierenden Objekte.
   * Here is the scope of the colliding objects.
   * @returns boolean
   */
  enemieStatusRelationPepe() {
    if (this.activeEnemyInteraction) {
      return;
    }

    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (
          this.character.y + this.character.height < enemy.y + enemy.height &&
          this.character.speedY < 0
        ) {
          this.activeEnemyInteraction = true;
          if (enemy instanceof Endboss) {
            enemy.hit_Boss();
          } else {
            enemy.hit_anyOpponent();
          }

          this.character.speedY = 10;

          setTimeout(() => {
            this.activeEnemyInteraction = false;
          }, 200);
        }
      }
    });
  }

  /**
   * Check if Pepe collision with Bottle.
   */
  checkBottleStatusToEarn() {
    this.level.bottles.forEach((bottle, index) => {
      if (
        this.character.isColliding(bottle) &&
        this.character.bottles.length < this.character.maxBottles
      ) {
        this.character.collectBottle();
        this.level.bottles.splice(index, 1);
        let newPercentage = Math.min(this.character.bottles.length * 20, 100);
        this.statusBarBottle.setPercentage(newPercentage);
      }
    });
  }

  /**
   * Check if Pepe collision with Bottle.
   */
  checkCoinStatusToEarn() {
    this.level.coins.forEach((coin, index) => {
      if (
        this.character.isColliding(coin) &&
        this.character.coins.length < this.character.maxCoins
      ) {
        this.character.collectCoin();
        this.level.coins.splice(index, 1);
        let newPercentage = Math.min(this.character.coins.length * 20, 100);
        this.statusBarCoin.setPercentage(newPercentage);
      }
    });
  }

  /**
   *
   */
  checkThrowableObjectCollisions() {
    this.throwableObjects.forEach((throwableObject) => {
      this.level.enemies.forEach((enemy) => {
        throwableObject.handleEnemyCollision_thisBottle(enemy);
      });
    });
  }

  /**
   * Flasche erstellen und Werfen.
   * Die Wurfrichtung der Flasche und die Flaschenanzahl von Pepe prüfen.
   */
  throwObject() {
    const now = Date.now();

    if (
      this.keyboard.THROW &&
      this.character.bottles.length > 0 &&
      now - this.lastThrowTime >= this.throwCooldown
    ) {
      let throwDirectionX = this.character.otherDirection ? -1 : 1;

      let bottle = new ThrowableObject(
        this.character.x + (throwDirectionX === 1 ? 70 : -70),
        this.character.y + 35,
        this,
        throwDirectionX
      );

      bottle.world = this;
      this.throwableObjects.push(bottle);
      this.character.bottles.pop();
      this.statusBarBottle.setPercentage(this.character.bottles.length * 20);
      this.lastThrowTime = now;
    }
  }

  /**
   * Draw() wird immer wieder aufgerufen.
   * Draw what ever in this.World
   * ACHTUNG: Es ist nicht das Selbe "draw()"  wie es in der class DrawableObject definiert ist.
   */
  draw() {
    if (isGameRunning) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.translate(this.camera_x, 0);
      this.addLevelObjects();
      this.ctx.translate(-this.camera_x, 0);
      this.addBars();
      this.ctx.translate(this.camera_x, 0);
      this.addToMap(this.character);
      this.addObjectsToMap(this.throwableObjects);
      this.ctx.translate(-this.camera_x, 0);
      this.setSelfDraw();
    }
  }

  /**
   *Zu Zeichnen!
   */
  addLevelObjects() {
    this.addObjectsToMap(this.level.background);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
  }

  /**
   *Zu Zeichnen!
   */
  addBars() {
    this.addToMap(this.statusBarPepe);
    this.addToMap(this.statusBarBoss);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarBottle);
  }

  setSelfDraw() {
    let self = this;

    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Die Fn ist nur eine Zwischenfunktion vom Zeichnen-Fn zum Zeichnen-addToMap, die auch eine Hilfsfunktion für die "draw"-Fn ist.
   * Adds any objects with specific attributes.
   * Im Grunde sollen sich diese Objekte ohne einer Benutzeingabe Automatisch bewegen. Im gegensatz zu Pepe wo der erst gezeichnet wird, alsbald eine Eingabe erfolg.
   * @param {The objects in this world.} objects
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Die if Abfragen händelt den Charakter, seinen Spiegelbild. Sowie die Gespiegelte Koardinaten des Canvas für den Charakter.
   * The if query handles the character, its mirror image, and the mirrored coordinates of the canvas for the character.
   * Add to Canvas Board each things.
   * @param {movable object} mo
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    // mo.drawFrame(this.ctx); // Hier Ausblenden - Kann man dev. mode schalter mache!

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Die "Flips" sind zum Spiegeln der Bilder.
   * Den von rechts-nach-links zustand setzen.
   * @param {movable-object} mo
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0); // Die Verschiebung um die eigene Y-Achse.
    this.ctx.scale(-1, 1); // Die Spieglung mit "-1" in der X-Achse. Die Y-Achse bleibt unverändert mit "1".
    mo.x = mo.x * -1; // Das Koardinatensystem zu dem Bild muss auch noch gespiegelt werden.
  }

  /**
   * Die "Flips" sind zum Spiegeln der Bilder.
   * Den von-links-nach-rechts zustand setzen.
   * @param {movable-object} mo
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1; // Das Koardinatensystem zu dem Bild muss auch noch gespiegelt werden.
    this.ctx.restore();
  }
}
