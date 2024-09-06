  /**
   * Handles the collision between Pepe and an opponent.
   * @param {Object} enemy - Gegnerobjekt
   */
  handleCollisionWithEnemy(enemy) {
    if (this.character.isColliding(enemy)) {
      this.lastEnemyColliding(enemy);
      this.activeEnemyAlsoHit(enemy);
    }
  }

  /**
   * Saves the last enemy Pepe collided with.
   * @param {Object} enemy - Gegnerobjekt
   */
  lastEnemyColliding(enemy) {
    this.character.lastCollidedEnemy = {
      ...enemy,
      x: enemy.x,
      y: enemy.y,
    };
  }

  /**
   * Performs actions when Pepe interacts with an enemy and hits the enemy.
   * @param {Object} enemy - Gegnerobjekt
   */
  activeEnemyAlsoHit(enemy) {
    this.activeEnemyInteraction = true;
    this.character.speedY = 10;

    if (enemy instanceof Endboss) {
      enemy.hit_Boss();
    } else {
      enemy.hit_anyOpponent();
    }

    this.collisionBlocked = true;

    setTimeout(() => {
      this.collisionBlocked = false;
      this.activeEnemyInteraction = false;
    }, 100);
  }