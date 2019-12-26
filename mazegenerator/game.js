class Game {
    constructor() {
        this.maze = null;
        this.player = null;
        this.enemies = null;
        this.started = false;
        this.debug = false;
        this.paused = false;
        this.lives = 3;
        this.score = 0;
        this.level = 1;
        this.dotsToEat = 0;
        this.dotsEaten = 0;
        this.highScore = 0;
        this.frightTime = 6;
        this.frightTimeStarted = 0;
        this.extraLifeGiven = false;
        this.ghostsEaten = 0;
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

    drawHeader(){
        let gameWidth =  maze.columns*maze.cellSize;

        push();
        //if (this.type == "PLAYER") debugger;
        fill(255,255,255);
        noStroke();
        textSize(20);
        textFont("PressStart");

        textAlign(CENTER, CENTER);
        
        text(this.score,100 , this.maze.cellSize*2.25);

        text("HIGH SCORE",gameWidth/2 , this.maze.cellSize*1.15);

        text(this.highScore,gameWidth/2 , this.maze.cellSize*2.25);

        if (game.debug) {
            text(this.level + " " + this.dotsEaten + " " +this.dotsToEat ,gameWidth-100 , this.maze.cellSize*2.25);
        }

        pop();

    }

    drawFooter(){
        let gameWidth =  maze.columns*maze.cellSize;
        let gameHeight =  maze.rows*maze.cellSize;
       

        for (let i = 1; i < this.lives; i++) {
            noStroke();
            fill(color(255, 255, 0));
            angleMode(DEGREES);  
            arc((maze.cellSize+maze.cellSize*i), gameHeight-this.maze.cellSize, maze.cellSize, maze.cellSize, 30, 330, PIE);    
        }

    }

    handleKeyPress(keyCode) {
        
    //Turn on debugging
    //D KEY
    if (keyCode == this.keyCodes.D) {
        this.debug = !this.debug;
    }


    if (keyCode == this.keyCodes.R) {
        this.gameOver();
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
                this.setEnemyMode(this.enemyModes.Wait);
                
            }
            else {
                this.returnEnemyToPreviousMode();
            }
        }
    }
    updateScore(points){

        this.score+=points;

        if (this.score >= this.highScore) {
            this.highScore = this.score;
        }

        //Extra life after 10,0000 points on level 1
        if (this.level == 1 && !this.extraLifeGiven && this.score >= 10000) {
            this.lives++;
            this.extraLifeGiven = true;
            gameSounds.pacExtraPac.play();
        }

    
    }
    enterFrightenedMode(){
        this.setEnemyMode(this.enemyModes.Frightened);

        if (this.level < 19) {
            this.frightTime = 6;
            this.frightTimeStarted = millis();
        }

        //TODO Start frightened timer and then handle blinking back to normal
    }
    exitFrightenedMode(){
        this.frightTimeStarted = 0;
        this.ghostsEaten = 0;
        this.returnEnemyToPreviousMode();
    }
    enemyEaten(enemy){
        this.ghostsEaten++;
        this.updateScore(this.ghostsEaten*200);
        enemy.reset();
        gameSounds.pacEatGhost.play();
    }
    setEnemyMode(mode){
        enemies.forEach(enemy => {
            if (!mode) {
                enemy.mode = enemy.modePrevious;
            }
            else {
                enemy.modePrevious = enemy.mode;
                enemy.mode = mode;
            }
            if (enemy.mode == this.enemyModes.Frightened) {
                enemy.isScared = true;
            }
            else {
                enemy.isScared = false;
            }
        });
    }
    returnEnemyToPreviousMode(){
        this.setEnemyMode(null);
        //this.setEnemyMode(enemies[0].modePrevious);
    }
    levelComplete(){
        this.level++;
        this.dotsEaten = 0;
        this.dotsToEat = 0;
        maze.replayCurrentMap();
        this.resetToStartingPositions();
    }
    dotWasEaten(){
        this.dotsEaten++;
    }
    playerWasHit(){
        this.lives--;
        if (this.lives<=0) {
            this.gameOver();
        }
        this.resetToStartingPositions();
    }
    resetToStartingPositions(){
        player.reset();
        enemies.forEach(enemy => {
            enemy.mode = game.enemyModes.Wait;
            enemy.modePrevious = game.enemyModes.Wait;
            enemy.reset();
        });
        this.started = false;
        this.frightTimeStarted = 0;
        this.ghostsEaten = 0;
    }
    gameOver(){
        maze.isInitialized = false;
        game.started = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.dotsToEat = 0;
        this.dotsEaten = 0;
        this.extraLifeGiven = false;
        this.resetToStartingPositions();
        gameSounds.pacSiren.stop();
        gameSounds.intro.stop();
        gameSounds.intro.play();
        maze.newLevel();
    }
    show(){
        
        if (!this.started) {
            push();
            textSize(30);
            fill(235,255,0);
            textAlign(CENTER, TOP);
            textFont("PressStart");
             text("ENTER TO START", width/2, height/2);
             pop();
        }

        if (this.paused) {
            push();
            textSize(30);
            fill(235,255,0);
            textAlign(CENTER, TOP);
            textFont("PressStart");
             text("PAUSED", width/2, height/2);
             pop();
        }


        game.drawFooter();
        game.drawHeader();

        //See if frighttime is over.
        if (this.frightTimeStarted != 0){
            let currentTime = floor((millis() - this.frightTimeStarted) / 1000);
            if (currentTime > 2) {
                if (currentTime % 2 != 0) {
                    enemies.forEach(enemy => {
                        enemy.isBlinking=true;
                    });
                }
                else {
                    enemies.forEach(enemy => {
                        enemy.isBlinking=false;
                    });
                }
            }

            if (currentTime >= this.frightTime){
                this.exitFrightenedMode();
            }
        }

        if (this.dotsEaten == this.dotsToEat){
            this.levelComplete();
        }

    }
}
