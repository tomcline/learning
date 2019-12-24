class Game {
    constructor() {
        this.maze = null;
        this.player = null;
        this.enemies = null;
        this.started = false;
        this.debug = false;
        this.paused = false;
        
        this.keyCodes = {
            D: 68,
            R: 82,
            SPACEBAR: 32
        }
        
        this.enemyModes = {
            Wait: 0,
            Chase: 1,
            Scatter: 2,
            Frightened: 3
        }
        
        this.enemyMode = this.enemyModes.Chase;
    }

    handleKeyPress(keyCode) {
        
    //Turn on debugging
    //D KEY
    if (keyCode == this.keyCodes.D) {
        this.debug = !this.debug;
    }


    if (keyCode == this.keyCodes.R) {
        initGame();
    }

    //Start game.
    if (!this.started && keyCode == ENTER){
        this.started = true;
        gameSounds.intro.stop();
        this.enemies.forEach(enemy => {
            enemy.mode = this.enemyModes.Chase;
        });
    }
    
    //Only response to key presses after game has started
    if (this.started && !this.paused && (keyCode == UP_ARROW ||  keyCode == DOWN_ARROW || keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) && this.maze && this.maze.isInitialized) {
       this.player.handleKeyPress(keyCode);
    }

    //SPACE BAR
    if (this.started && keyCode == this.keyCodes.SPACEBAR) {
        this.paused = !this.paused;
        if (game.paused) {
            this.enemies.forEach(enemy => {
                enemy.modePrevious = enemy.mode;
                enemy.mode = this.enemyModes.Wait;
            });
        }
        else {
            this.enemies.forEach(enemy => {
                enemy.mode = enemy.modePrevious;
            });
        }
    }
    }
}
