    if (this.world && this.world.level && this.world.level.enemies) {
        for (let i = 0; i < this.world.level.enemies.length; i++) {
            let enemy = this.world.level.enemies[i];
            if (this.isColliding(enemy)) {
                console.log('Kollision mit:', enemy);
                break; // Abbricht die Schleife, sobald eine Kollision gefunden wurde
            }
        }
    }